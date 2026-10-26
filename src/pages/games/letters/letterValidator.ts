// Letter bank validator built on the shared spec-driven validator.
// Also verifies the letter-specific invariant: correctLetter matches word[missingIndex].
import type { RawLetterItem } from '../../../engine/questionTypes'
import { LETTER_TOPICS } from '../../../engine/questionTypes'
import { validateBank, type ValidationResult } from '../../../engine/bankValidator'

export function validateLetterItem(item: RawLetterItem): ValidationResult {
  const blanked = (q: RawLetterItem) =>
    q.word.slice(0, q.missingIndex) + '_' + q.word.slice(q.missingIndex + 1)

  const base = validateBank([item], {
    name: 'letter bank',
    getId: (q) => q.id,
    getPrompt: blanked,
    getOptions: (q) => q.options,
    getCorrect: (q) => q.correctLetter,
    difficulty: { get: (q) => q.difficulty, min: 1, max: 3 },
    topic: { get: (q) => q.topic, allowed: LETTER_TOPICS },
  })

  const errors = [...base.errors]

  if (item.word && item.word !== item.word.toUpperCase()) {
    errors.push(`Item ${item.id}: word must be uppercase.`)
  }
  if (
    typeof item.missingIndex !== 'number' ||
    item.missingIndex < 0 ||
    item.missingIndex >= item.word.length
  ) {
    errors.push(`Item ${item.id}: missingIndex (${item.missingIndex}) out of bounds for "${item.word}".`)
  } else if (item.correctLetter.length === 1 && item.word[item.missingIndex] !== item.correctLetter) {
    errors.push(
      `Item ${item.id}: correctLetter '${item.correctLetter}' does not match word char '${item.word[item.missingIndex]}'.`
    )
  }

  return { valid: errors.length === 0, errors }
}

export function validateLetterBank(bank: readonly RawLetterItem[]): ValidationResult {
  const base = validateBank(bank, {
    name: 'letter bank',
    getId: (q) => q.id,
    getPrompt: (q) =>
      q.word.slice(0, q.missingIndex) + '_' + q.word.slice(q.missingIndex + 1),
    getOptions: (q) => q.options,
    getCorrect: (q) => q.correctLetter,
    difficulty: { get: (q) => q.difficulty, min: 1, max: 3 },
    topic: { get: (q) => q.topic, allowed: LETTER_TOPICS },
  })

  const errors = [...base.errors]
  for (const item of bank) {
    errors.push(...validateLetterItem(item).errors.filter((e) => !base.errors.includes(e)))
  }

  return { valid: errors.length === 0, errors }
}