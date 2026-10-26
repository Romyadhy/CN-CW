import type { SentenceQuestion } from '../../../engine/questionTypes'
import sentenceBank from './sentenceBank'
import { shuffle } from '../../../engine/shuffle'
import { createDeck } from '../../../engine/deck'

export type SentenceConfig = {
  maxDifficulty: 1 | 2 | 3
}

export const DEFAULT_CONFIG: SentenceConfig = { maxDifficulty: 1 }

const deck = createDeck<SentenceQuestion>(
  (q) => q.id,
  (q) => q.topic
)

export function resetSentenceDeck(): void {
  deck.reset()
}

export function generateSentenceQuestion(config: SentenceConfig): SentenceQuestion {
  const pool = sentenceBank.filter((q) => q.difficulty <= config.maxDifficulty)
  const picked = deck.next(pool)

  // Shuffle options (options array already contains the correct answer)
  return { ...picked, options: shuffle(picked.options) }
}