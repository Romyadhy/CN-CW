import { letterBank } from './letterBank'
import { shuffle } from '../../../engine/shuffle'
import { createDeck } from '../../../engine/deck'
import type { LetterQuestion, RawLetterItem } from '../../../engine/questionTypes'

const deck = createDeck<RawLetterItem>(
  (item) => item.id,
  (item) => item.topic
)

export function resetLetterDeck(): void {
  deck.reset()
}

export function generateLetterQuestion(level: number): LetterQuestion {
  const eligible = letterBank.filter((item) => item.difficulty === level)
  const pool = eligible.length > 0 ? eligible : letterBank.filter((item) => item.difficulty === 1)
  return build(deck.next(pool))
}

function build(item: RawLetterItem): LetterQuestion {
  const displayWord =
    item.word.slice(0, item.missingIndex) + '_' + item.word.slice(item.missingIndex + 1)
  return {
    ...item,
    options: shuffle(item.options) as [string, string, string],
    displayWord,
  }
}