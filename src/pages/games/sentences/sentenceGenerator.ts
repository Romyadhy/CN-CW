import type { SentenceQuestion } from '../../../engine/questionTypes'
import sentenceBank from './sentenceBank'

export type SentenceConfig = {
  maxDifficulty: 1 | 2 | 3
}

export const DEFAULT_CONFIG: SentenceConfig = { maxDifficulty: 1 }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateSentenceQuestion(
  config: SentenceConfig,
  lastId?: string
): SentenceQuestion {
  const pool = sentenceBank.filter((q) => q.difficulty <= config.maxDifficulty)

  // Avoid immediate repeat when alternatives exist
  const filtered = pool.length > 1 ? pool.filter((q) => q.id !== lastId) : pool

  // Fallback: if pool exhausted reset to full pool
  const candidates = filtered.length > 0 ? filtered : pool

  const picked = candidates[Math.floor(Math.random() * candidates.length)]

  // Shuffle options (options array already contains the correct answer)
  return { ...picked, options: shuffle(picked.options) }
}
