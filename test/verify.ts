import assert from 'node:assert'
import { generateCountingQuestion, BASIC_CONFIG, EXPANDED_CONFIG, resetCountingDeck } from '../src/pages/games/counting/countingGenerator'
import { generateSentenceQuestion, resetSentenceDeck } from '../src/pages/games/sentences/sentenceGenerator'
import sentenceBank from '../src/pages/games/sentences/sentenceBank'
import { validateSentenceBank } from '../src/pages/games/sentences/sentenceValidator'
import countingObjects from '../src/data/countingObjects'
import { recordObservation, getRecentObservations, resetTracker } from '../src/engine/performanceTracker'
import { computeNextDifficulty, resetAdaptiveState, DEFAULT_ADAPTIVE_CONFIG } from '../src/engine/adaptiveDifficulty'
import { letterBank } from '../src/pages/games/letters/letterBank'
import { validateLetterBank, validateLetterItem } from '../src/pages/games/letters/letterValidator'
import { generateLetterQuestion, resetLetterDeck } from '../src/pages/games/letters/letterGenerator'
import { createDeck } from '../src/engine/deck'
import { shuffle } from '../src/engine/shuffle'
import { COUNTING_TOPICS, SENTENCE_TOPICS, LETTER_TOPICS } from '../src/engine/questionTypes'

console.log('🧪 Starting Verification Tests...\n')

// 0. Shared primitives
console.log('--- 0. Testing shared shuffle & deck ---')
const src = [1, 2, 3, 4, 5]
const shuffled = shuffle(src)
assert.strictEqual(shuffled.length, src.length, 'shuffle must keep length')
assert.deepStrictEqual([...shuffled].sort(), src, 'shuffle must keep all elements')
assert.deepStrictEqual(src, [1, 2, 3, 4, 5], 'shuffle must not mutate the source')

{
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  const deck = createDeck<{ id: string }>((i) => i.id)
  const seen: string[] = []
  for (let i = 0; i < 30; i++) seen.push(deck.next(items).id)
  // Every item must be used before a reshuffle: first 3 are all distinct
  assert.strictEqual(new Set(seen.slice(0, 3)).size, 3, 'deck must exhaust pool before reshuffle')
}
{
  // 1-item pool must not crash
  const deck = createDeck<{ id: string }>((i) => i.id)
  assert.strictEqual(deck.next([{ id: 'only' }]).id, 'only')
}
console.log('✅ Shared primitives passed.')

// 1. Counting Generator Tests
console.log('\n--- 1. Testing Counting Generator ---')
resetCountingDeck()
for (let i = 0; i < 100; i++) {
  const q = generateCountingQuestion(BASIC_CONFIG)
  assert(q.count >= 1 && q.count <= 5, `Basic count out of range: ${q.count}`)
  assert.strictEqual(q.options.length, 3, 'Options length must be 3')
  assert.strictEqual(new Set(q.options).size, 3, 'Options must be distinct')
  assert(q.options.includes(q.correct), 'Options must include correct answer')
  assert.strictEqual(q.count, q.correct, 'Count must equal correct answer')
}
for (let i = 0; i < 100; i++) {
  const q = generateCountingQuestion(EXPANDED_CONFIG)
  assert(q.count >= 1 && q.count <= 10, `Expanded count out of range: ${q.count}`)
  assert.strictEqual(new Set(q.options).size, 3, 'Options must be distinct')
  assert(q.options.includes(q.correct), 'Options must include correct answer')
}
assert(countingObjects.length >= 30, `Expected >= 30 objects, found ${countingObjects.length}`)
for (const o of countingObjects) {
  assert(COUNTING_TOPICS.includes(o.topic), `Object ${o.name} has invalid topic ${o.topic}`)
  assert(o.name && o.emoji, `Object ${o.name} missing name/emoji`)
}
console.log('✅ Counting Generator passed 200 iterations.')

// 2. Sentence Bank & Generator
console.log('\n--- 2. Testing Sentence Bank & Generator ---')
assert(sentenceBank.length >= 90, `Expected >= 90 questions, found ${sentenceBank.length}`)

const sentenceRes = validateSentenceBank(sentenceBank)
assert.strictEqual(sentenceRes.valid, true, `Sentence bank invalid:\n${sentenceRes.errors.join('\n')}`)

const perSentenceDifficulty = { 1: 0, 2: 0, 3: 0 }
for (const q of sentenceBank) {
  perSentenceDifficulty[q.difficulty]++
  assert(SENTENCE_TOPICS.includes(q.topic), `${q.id} invalid topic ${q.topic}`)
  assert(q.options.length === 3, `Options must be 3 for ${q.id}`)
  assert(new Set(q.options).size === 3, `Options not distinct for ${q.id}`)
  assert(q.options.includes(q.correctAnswer), `correctAnswer not in options for ${q.id}`)
}

resetSentenceDeck()
for (let i = 0; i < 100; i++) {
  const q1 = generateSentenceQuestion({ maxDifficulty: 1 })
  assert.strictEqual(q1.difficulty, 1, 'maxDifficulty 1 returned higher diff')
  assert.strictEqual(new Set(q1.options).size, 3, 'Options must be 3 distinct')
  assert(q1.options.includes(q1.correctAnswer), 'Options must include correct answer')
  assert(generateSentenceQuestion({ maxDifficulty: 2 }).difficulty <= 2, 'maxDifficulty 2 exceeded')
  assert(generateSentenceQuestion({ maxDifficulty: 3 }).difficulty <= 3, 'maxDifficulty 3 exceeded')
}
console.log(
  `✅ Sentence Bank (${sentenceBank.length}) & Generator passed. ` +
    `L1=${perSentenceDifficulty[1]} L2=${perSentenceDifficulty[2]} L3=${perSentenceDifficulty[3]}`
)

// 3. Adaptive Difficulty & Performance Tracker Tests
console.log('\n--- 3. Testing Adaptive Difficulty & Performance Tracker ---')
resetTracker()
resetAdaptiveState()

for (let i = 0; i < 7; i++) {
  recordObservation({ gameId: 'counting', skill: 'counting', firstAttemptSuccess: true, attempts: 1, hintUsed: false, completed: true })
}
let next = computeNextDifficulty('counting', 1, 1, 2, 7)
assert.strictEqual(next, 1, 'Should not promote before 8 observations')

recordObservation({ gameId: 'counting', skill: 'counting', firstAttemptSuccess: true, attempts: 1, hintUsed: false, completed: true })
next = computeNextDifficulty('counting', 1, 1, 2, 8)
assert.strictEqual(next, 2, 'Should promote to level 2 after 8/8 success')

next = computeNextDifficulty('counting', 2, 1, 2, 8)
assert.strictEqual(next, 2, 'Should not exceed maxLevel 2')

next = computeNextDifficulty('counting', 2, 1, 2, 9)
assert.strictEqual(next, 2, 'Should not change during cooldown')

const sentenceObs = getRecentObservations('sentences')
assert.strictEqual(sentenceObs.length, 0, 'Sentences history must not be polluted by counting')

resetTracker('sentences')
resetAdaptiveState('sentences')
for (let i = 0; i < 8; i++) {
  recordObservation({ gameId: 'sentences', skill: 'vocabulary', firstAttemptSuccess: i < 3, attempts: 2, hintUsed: false, completed: true })
}
const demoted = computeNextDifficulty('sentences', 2, 1, 3, 8)
assert.strictEqual(demoted, 1, 'Should demote from level 2 to level 1 with <= 4 successes')

resetTracker('counting')
resetAdaptiveState('counting')
for (let i = 0; i < 8; i++) {
  recordObservation({ gameId: 'counting', skill: 'counting', firstAttemptSuccess: true, attempts: 1, hintUsed: true, completed: true })
}
const noPromoteWithHint = computeNextDifficulty('counting', 1, 1, 2, 8)
assert.strictEqual(noPromoteWithHint, 1, 'Questions with hints must not count toward promotion')
console.log('✅ Adaptive Difficulty & Performance Tracker passed all edge cases.')

// 4. Letter Game Tests
console.log('\n--- 4. Testing Letter Game ---')
const bankRes = validateLetterBank(letterBank)
assert.strictEqual(bankRes.valid, true, `Letter bank invalid:\n${bankRes.errors.join('\n')}`)
assert(letterBank.length >= 90, `Expected >= 90 items, got ${letterBank.length}`)

const perLetterDifficulty = { 1: 0, 2: 0, 3: 0 }
for (const item of letterBank) {
  perLetterDifficulty[item.difficulty]++
  assert(LETTER_TOPICS.includes(item.topic), `${item.id} invalid topic ${item.topic}`)
  assert.strictEqual(validateLetterItem(item).valid, true, `Item ${item.id} invalid`)

  // Band rule: L1 blanks first/last, L2/L3 blank a middle letter.
  const isEdge = item.missingIndex === 0 || item.missingIndex === item.word.length - 1
  if (item.difficulty === 1) assert(isEdge, `${item.id}: L1 must blank first/last letter`)
  else assert(!isEdge, `${item.id}: L${item.difficulty} must blank a middle letter`)
}
for (const d of [1, 2, 3] as const) {
  assert(perLetterDifficulty[d] >= 30, `Expected >= 30 items at difficulty ${d}, got ${perLetterDifficulty[d]}`)
}

resetLetterDeck()
for (let i = 0; i < 50; i++) {
  const q = generateLetterQuestion(1)
  assert.strictEqual(q.options.length, 3, 'Options must be 3')
  assert.strictEqual(new Set(q.options).size, 3, 'Options must be distinct')
  assert(q.options.includes(q.correctLetter), 'Correct letter must be in options')
  assert.strictEqual(q.options.filter((o) => o === q.correctLetter).length, 1, 'Correct letter must appear exactly once')
  assert.strictEqual(q.displayWord[q.missingIndex], '_', 'Display word must have underscore at missing index')
  assert.strictEqual(q.word[q.missingIndex], q.correctLetter, 'Correct letter must match word at index')
  assert.strictEqual(q.word.toUpperCase(), q.word, 'Word must be uppercase')
}

// Deck exhaustion: 40 draws from a 30-item level must cover all 30 before repeating
resetLetterDeck()
const firstPass = new Set<string>()
for (let i = 0; i < 30; i++) firstPass.add(generateLetterQuestion(1).id)
assert.strictEqual(firstPass.size, 30, `Deck must exhaust all 30 L1 items, saw ${firstPass.size}`)

// Difficulty boundaries
resetLetterDeck()
assert.strictEqual(generateLetterQuestion(1).difficulty, 1)
assert(generateLetterQuestion(3).difficulty <= 3, 'Difficulty must not exceed 3')
console.log(
  `✅ Letter Game passed. L1=${perLetterDifficulty[1]} L2=${perLetterDifficulty[2]} L3=${perLetterDifficulty[3]}`
)

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!')
void DEFAULT_ADAPTIVE_CONFIG