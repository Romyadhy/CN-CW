// Shared question types and adaptive engine types

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

export type QuestionObservation = {
  gameId: 'counting' | 'sentences'
  skill: string
  firstAttemptSuccess: boolean
  attempts: number
  hintUsed: boolean
  completed: boolean
}
