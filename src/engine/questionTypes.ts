// Shared question types and adaptive engine types

export type GameId = 'counting' | 'sentences' | 'letters'

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
  difficulty: 1 | 2 | 3
}

export type LetterQuestion = {
  id: string
  word: string // Complete uppercase word, e.g. "APEL"
  missingIndex: number // 0-based index
  correctLetter: string // Uppercase single character
  options: string[] // 3 distinct uppercase letters
  displayWord: string // Word with '_' at missingIndex, e.g. "A_EL"
  image?: string // Emoji or image representation
  hint?: string
  difficulty: 1 | 2 | 3
  category: 'fruit' | 'animal' | 'body' | 'object'
}

export type QuestionObservation = {
  gameId: GameId
  skill: string
  firstAttemptSuccess: boolean
  attempts: number
  hintUsed: boolean
  completed: boolean
}
