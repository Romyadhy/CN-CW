// Sentence bank validator built on the shared spec-driven validator.
import type { SentenceQuestion } from '../../../engine/questionTypes'
import { SENTENCE_TOPICS } from '../../../engine/questionTypes'
import { validateBank, type ValidationResult } from '../../../engine/bankValidator'

export function validateSentenceBank(bank: readonly SentenceQuestion[]): ValidationResult {
  return validateBank(bank, {
    name: 'sentence bank',
    getId: (q) => q.id,
    getPrompt: (q) => `${q.sentenceBefore} _ ${q.sentenceAfter}`,
    getOptions: (q) => q.options,
    getCorrect: (q) => q.correctAnswer,
    difficulty: { get: (q) => q.difficulty, min: 1, max: 3 },
    topic: { get: (q) => q.topic, allowed: SENTENCE_TOPICS },
  })
}