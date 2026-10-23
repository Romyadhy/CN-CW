// Type definitions for the Complete the Missing Letter game
export type LetterCategory = 'fruit' | 'animal' | 'body' | 'object'

export type RawLetterItem = {
  id: string
  word: string // Complete uppercase word
  missingIndex: number // 0-based index of the missing letter
  correctLetter: string // Uppercase single character
  options: [string, string, string] // Exactly 3 distinct uppercase letters (includes correct)
  image?: string // Emoji icon
  hint?: string
  difficulty: 1 | 2 | 3
  category: LetterCategory
}

export type LetterQuestion = RawLetterItem & {
  displayWord: string // Derived: e.g. "A_EL"
}
