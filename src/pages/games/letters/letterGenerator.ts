import { letterBank } from './letterBank'
import type { LetterQuestion } from '../../../engine/questionTypes'

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

let deck: typeof letterBank = []
let previousId: string | null = null

export function generateLetterQuestion(level: number, _lastQuestion?: LetterQuestion): LetterQuestion {
  const eligible = letterBank.filter((item) => item.difficulty === level)
  if (eligible.length === 0) {
    // Fallback: any difficulty if level misaligned
    const fallback = letterBank.filter((item) => item.difficulty === 1)
    return build(fallback[Math.floor(Math.random() * fallback.length)])
  }

  if (deck.length === 0) {
    deck = shuffle(eligible)
    // Avoid repeating previous question across reset when alternatives exist
    if (previousId && deck.length > 1) {
      const prevIndex = deck.findIndex((i) => i.id === previousId)
      if (prevIndex === 0) {
        // Swap with another to avoid immediate repeat
        const swapWith = 1 + Math.floor(Math.random() * (deck.length - 1))
        ;[deck[0], deck[swapWith]] = [deck[swapWith], deck[0]]
      }
    }
  }

  const item = deck.pop()!
  previousId = item.id
  return build(item)
}

export function resetLetterDeck(): void {
  deck = []
  previousId = null
}

function build(item: typeof letterBank[0]): LetterQuestion {
  const displayWord = item.word.slice(0, item.missingIndex) + '_' + item.word.slice(item.missingIndex + 1)
  const shuffledOptions = shuffle([...item.options]) as [string, string, string]
  return {
    id: item.id,
    word: item.word,
    missingIndex: item.missingIndex,
    correctLetter: item.correctLetter,
    options: shuffledOptions,
    displayWord,
    image: item.image,
    hint: item.hint,
    difficulty: item.difficulty,
    category: item.category,
  }
}
