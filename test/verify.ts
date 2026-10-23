import assert from 'node:assert'
import { generateCountingQuestion, BASIC_CONFIG, EXPANDED_CONFIG } from '../src/pages/games/counting/countingGenerator'
import { generateSentenceQuestion } from '../src/pages/games/sentences/sentenceGenerator'
import sentenceBank from '../src/pages/games/sentences/sentenceBank'
import { recordObservation, getRecentObservations, resetTracker } from '../src/engine/performanceTracker'
import { computeNextDifficulty, resetAdaptiveState, DEFAULT_ADAPTIVE_CONFIG } from '../src/engine/adaptiveDifficulty'
import { letterBank } from '../src/pages/games/letters/letterBank'
import { validateLetterBank, validateLetterItem } from '../src/pages/games/letters/letterValidator'
import { generateLetterQuestion, resetLetterDeck } from '../src/pages/games/letters/letterGenerator'

console.log('🧪 Starting Verification Tests...\n')

// 1. Counting Generator Tests
console.log('--- 1. Testing Counting Generator ---')
for (let i = 0; i < 100; i++) {
  const q = generateCountingQuestion(BASIC_CONFIG)
  assert(q.count >= 1 && q.count <= 5, `Basic count out of range: ${q.count}`)
  assert.strictEqual(q.options.length, 3, 'Options length must be 3')
  const distinct = new Set(q.options)
  assert.strictEqual(distinct.size, 3, 'Options must be distinct')
  assert(q.options.includes(q.correct), 'Options must include correct answer')
  assert.strictEqual(q.count, q.correct, 'Count must equal correct answer')
}

for (let i = 0; i < 100; i++) {
  const q = generateCountingQuestion(EXPANDED_CONFIG)
  assert(q.count >= 1 && q.count <= 10, `Expanded count out of range: ${q.count}`)
  assert.strictEqual(q.options.length, 3, 'Options length must be 3')
  assert.strictEqual(new Set(q.options).size, 3, 'Options must be distinct')
  assert(q.options.includes(q.correct), 'Options must include correct answer')
}
console.log('✅ Counting Generator passed 200 iterations.')

// 2. Sentence Generator Tests
console.log('\n--- 2. Testing Sentence Bank & Generator ---')
assert(sentenceBank.length >= 15, `Expected >= 15 questions, found ${sentenceBank.length}`)

for (const q of sentenceBank) {
  assert(q.id, 'Question must have id')
  assert(q.sentenceBefore !== undefined, 'sentenceBefore required')
  assert(q.sentenceAfter !== undefined, 'sentenceAfter required')
  assert(q.options.length === 3, `Options must be 3 for ${q.id}`)
  assert(new Set(q.options).size === 3, `Options not distinct for ${q.id}`)
  assert(q.options.includes(q.correctAnswer), `correctAnswer not in options for ${q.id}`)
}

for (let i = 0; i < 100; i++) {
  const q1 = generateSentenceQuestion({ maxDifficulty: 1 })
  assert.strictEqual(q1.difficulty, 1, 'maxDifficulty 1 returned higher diff')
  assert.strictEqual(new Set(q1.options).size, 3, 'Options must be 3 distinct')
  assert(q1.options.includes(q1.correctAnswer), 'Options must include correct answer')

  const q2 = generateSentenceQuestion({ maxDifficulty: 2 })
  assert(q2.difficulty <= 2, 'maxDifficulty 2 exceeded')

  const q3 = generateSentenceQuestion({ maxDifficulty: 3 })
  assert(q3.difficulty <= 3, 'maxDifficulty 3 exceeded')
}
console.log('✅ Sentence Bank & Generator passed all checks.')

// 3. Adaptive Difficulty & Performance Tracker Tests
console.log('\n--- 3. Testing Adaptive Difficulty & Performance Tracker ---')
resetTracker()
resetAdaptiveState()

// Under 8 observations -> no change
for (let i = 0; i < 7; i++) {
  recordObservation({
    gameId: 'counting',
    skill: 'counting',
    firstAttemptSuccess: true,
    attempts: 1,
    hintUsed: false,
    completed: true,
  })
}
let next = computeNextDifficulty('counting', 1, 1, 2, 7)
assert.strictEqual(next, 1, 'Should not promote before 8 observations')

// 8th observation with high success -> promote from 1 to 2
recordObservation({
  gameId: 'counting',
  skill: 'counting',
  firstAttemptSuccess: true,
  attempts: 1,
  hintUsed: false,
  completed: true,
})
next = computeNextDifficulty('counting', 1, 1, 2, 8)
assert.strictEqual(next, 2, 'Should promote to level 2 after 8/8 success')

// Boundary test: at max level, should not exceed maxLevel
next = computeNextDifficulty('counting', 2, 1, 2, 8)
assert.strictEqual(next, 2, 'Should not exceed maxLevel 2')

// Oscillation prevention test: without fresh observations, should not change immediately
next = computeNextDifficulty('counting', 2, 1, 2, 9)
assert.strictEqual(next, 2, 'Should not change during cooldown')

// No cross-game performance leakage
const sentenceObs = getRecentObservations('sentences')
assert.strictEqual(sentenceObs.length, 0, 'Sentences history must not be polluted by counting')

// Demotion test for sentences
resetTracker('sentences')
resetAdaptiveState('sentences')
for (let i = 0; i < 8; i++) {
  recordObservation({
    gameId: 'sentences',
    skill: 'vocabulary',
    firstAttemptSuccess: i < 3, // only 3 out of 8 successes (<= 4 demote threshold)
    attempts: 2,
    hintUsed: false,
    completed: true,
  })
}
const demoted = computeNextDifficulty('sentences', 2, 1, 3, 8)
assert.strictEqual(demoted, 1, 'Should demote from level 2 to level 1 with <= 4 successes')

// Hint penalty test: hint used should not count toward firstAttemptSuccess promotion
resetTracker('counting')
resetAdaptiveState('counting')
for (let i = 0; i < 8; i++) {
  recordObservation({
    gameId: 'counting',
    skill: 'counting',
    firstAttemptSuccess: true,
    attempts: 1,
    hintUsed: true, // hint was used!
    completed: true,
  })
}
const noPromoteWithHint = computeNextDifficulty('counting', 1, 1, 2, 8)
assert.strictEqual(noPromoteWithHint, 1, 'Questions with hints must not count toward promotion threshold')

console.log('✅ Adaptive Difficulty & Performance Tracker passed all edge cases.')

// 4. Letter Game Tests
console.log('\n--- 4. Testing Letter Game ---')

const bankRes = validateLetterBank(letterBank)
assert.strictEqual(bankRes.valid, true, `Letter bank invalid: ${bankRes.errors.join(', ')}`)
assert.strictEqual(letterBank.length, 30, `Expected 30 items, got ${letterBank.length}`)

for (let i = 0; i < 50; i++) {
  resetLetterDeck()
  const q = generateLetterQuestion(1)
  assert.strictEqual(q.options.length, 3, 'Options must be 3')
  assert.strictEqual(new Set(q.options).size, 3, 'Options must be distinct')
  assert(q.options.includes(q.correctLetter), 'Correct letter must be in options')
  assert.strictEqual(q.options.filter((o) => o === q.correctLetter).length, 1, 'Correct letter must appear exactly once')
  assert.strictEqual(q.displayWord[q.missingIndex], '_', 'Display word must have underscore at missing index')
  assert.strictEqual(q.word[q.missingIndex], q.correctLetter, 'Correct letter must match word at index')
  assert.strictEqual(q.word.toUpperCase(), q.word, 'Word must be uppercase')
}
console.log('✅ Letter generator passed 50 iterations.')

// Anti-repetition: with 30 items, running 35 times should not crash and should use deck
resetLetterDeck()
const seenIds = new Set<string>()
for (let i = 0; i < 35; i++) {
  const q = generateLetterQuestion(1)
  seenIds.add(q.id)
}
assert(seenIds.size > 1, 'Deck should provide variety')
console.log('✅ Anti-repetition / deck exhaustion passed.')

// Difficulty boundaries
resetLetterDeck()
const q1 = generateLetterQuestion(1)
assert.strictEqual(q1.difficulty, 1)
const q2 = generateLetterQuestion(3)
assert(q2.difficulty <= 3, 'Difficulty must not exceed 3')
console.log('✅ Difficulty boundaries passed.')

console.log('✅ Letter Game Tests passed.')
console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!')
