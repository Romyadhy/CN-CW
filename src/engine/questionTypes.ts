// Shared question types, topics and adaptive engine types.

export type GameId = 'counting' | 'sentences' | 'letters'

export const COUNTING_TOPICS = ['fruit', 'animal', 'transport', 'shape', 'nature'] as const
export type CountingTopic = (typeof COUNTING_TOPICS)[number]

export const SENTENCE_TOPICS = [
  'body',
  'color',
  'animal',
  'manners',
  'place',
  'transport',
  'weather',
  'family',
  'food',
  'activity',
] as const
export type SentenceTopic = (typeof SENTENCE_TOPICS)[number]

export const LETTER_TOPICS = [
  'fruit',
  'animal',
  'body',
  'object',
  'nature',
  'place',
  'food',
  'family',
  'color',
  'transport',
  'verb',
] as const
export type LetterTopic = (typeof LETTER_TOPICS)[number]

/** @deprecated kept for compatibility; use LetterTopic */
export type LetterCategory = LetterTopic

export type RawLetterItem = {
  id: string
  word: string // Complete uppercase word
  missingIndex: number // 0-based index of the missing letter
  correctLetter: string // Uppercase single character
  options: [string, string, string] // Exactly 3 distinct uppercase letters (includes correct)
  image?: string // Emoji icon
  hint?: string
  difficulty: 1 | 2 | 3
  topic: LetterTopic
}

export type LetterQuestion = RawLetterItem & {
  displayWord: string // Derived: e.g. "A_EL"
}

export type CountingQuestion = {
  count: number
  objectName: string
  emoji: string
  options: number[]
  correct: number
}

export type SentenceQuestion = {
  id: string
  sentenceBefore: string
  sentenceAfter: string
  correctAnswer: string
  options: string[]
  image?: string
  hint?: string
  skill: 'vocabulary' | 'action' | 'context'
  topic: SentenceTopic
  difficulty: 1 | 2 | 3
}

export type QuestionObservation = {
  gameId: GameId
  skill: string
  firstAttemptSuccess: boolean
  attempts: number
  hintUsed: boolean
  completed: boolean
}