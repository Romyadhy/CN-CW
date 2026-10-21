import countingObjects, { type CountingObject } from '../../../data/countingObjects'
import type { CountingQuestion } from '../../../engine/questionTypes'

export type CountingConfig = {
  minCount: number
  maxCount: number
}

export const BASIC_CONFIG: CountingConfig = { minCount: 1, maxCount: 5 }
export const EXPANDED_CONFIG: CountingConfig = { minCount: 1, maxCount: 10 }

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Generate one wrong answer distinct from correct and other wrongs, within 1..maxCount */
function wrongAnswer(correct: number, used: number[], max: number): number {
  const pool = Array.from({ length: max }, (_, i) => i + 1).filter(
    (n) => n !== correct && !used.includes(n)
  )
  // ponytail: if pool exhausted (tiny range), pick from wider range
  if (pool.length === 0) {
    const fallback = [correct - 1, correct + 1, correct + 2].find(
      (n) => n >= 1 && n !== correct && !used.includes(n)
    )
    return fallback ?? (correct === 1 ? 2 : 1)
  }
  return pool[randInt(0, pool.length - 1)]
}

export function generateCountingQuestion(
  config: CountingConfig,
  lastObjectName?: string
): CountingQuestion {
  // Avoid immediate object repeat when alternatives exist
  const pool =
    countingObjects.length > 1
      ? countingObjects.filter((o: CountingObject) => o.name !== lastObjectName)
      : countingObjects

  const obj = pool[randInt(0, pool.length - 1)]
  const correct = randInt(config.minCount, config.maxCount)

  const w1 = wrongAnswer(correct, [], config.maxCount)
  const w2 = wrongAnswer(correct, [w1], config.maxCount)
  const options = shuffle([correct, w1, w2])

  return { count: correct, objectName: obj.name, emoji: obj.emoji, options, correct }
}
