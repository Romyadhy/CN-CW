// Shuffled-deck selection shared by every game generator.
import { shuffle } from './shuffle'

export type Deck<T> = {
  /** Take the next item from the shuffled deck, refilling when the pool is exhausted. */
  next: (pool: readonly T[]) => T
  reset: () => void
}

/**
 * Every eligible item is used once before the deck reshuffles.
 * - never mutates `pool`
 * - never repeats the previous item immediately across a reshuffle when alternatives exist
 * - prefers a different `topic` than the previous pick when alternatives exist
 * - handles a 1-item pool without crashing
 */
export function createDeck<T>(
  idOf: (item: T) => string,
  topicOf?: (item: T) => string | undefined
): Deck<T> {
  let queue: T[] = []
  let previousId: string | null = null
  let previousTopic: string | undefined

  return {
    next(pool) {
      if (pool.length === 0) throw new Error('createDeck: empty pool')

      // ponytail: O(n) prune per call, fine for hand-curated banks (<200 items)
      queue = queue.filter((item) => pool.includes(item))
      if (queue.length === 0) queue = shuffle(pool)

      const last = queue.length - 1

      // Avoid immediate repeat across a reshuffle
      if (queue.length > 1 && previousId && idOf(queue[last]) === previousId) {
        const swapWith = Math.floor(Math.random() * last)
        ;[queue[last], queue[swapWith]] = [queue[swapWith], queue[last]]
      }

      // Prefer a different topic than the previous question
      if (
        topicOf &&
        previousTopic &&
        queue.length > 1 &&
        topicOf(queue[last]) === previousTopic
      ) {
        const idx = queue.findIndex((item) => topicOf(item) !== previousTopic)
        if (idx >= 0 && idx !== last) {
          ;[queue[last], queue[idx]] = [queue[idx], queue[last]]
        }
      }

      const item = queue.pop()!
      previousId = idOf(item)
      previousTopic = topicOf ? topicOf(item) : undefined
      return item
    },
    reset() {
      queue = []
      previousId = null
      previousTopic = undefined
    },
  }
}