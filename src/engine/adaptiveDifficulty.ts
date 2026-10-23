// ponytail: rule-based invisible adaptive difficulty engine
import type { QuestionObservation, GameId } from './questionTypes'
import { getRecentObservations } from './performanceTracker'

export type AdaptiveConfig = {
  windowSize: number
  promoteThreshold: number
  demoteThreshold: number
  cooldownObservations: number
}

export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveConfig = {
  windowSize: 8,
  promoteThreshold: 7, // >= 7 first-attempt successes without hint
  demoteThreshold: 4,  // <= 4 first-attempt successes
  cooldownObservations: 8, // fresh observations needed before next change
}

export const LETTERS_ADAPTIVE_CONFIG: AdaptiveConfig = {
  windowSize: 4,
  promoteThreshold: 4, // 4/4 first-attempt successes without hint
  demoteThreshold: 1,  // 0-1 successes
  cooldownObservations: 4,
}

// Track observations count at last change to prevent oscillation
const lastChangeCount: Record<GameId, number> = {
  counting: 0,
  sentences: 0,
  letters: 0,
}

export function resetAdaptiveState(gameId?: GameId): void {
  if (gameId) {
    lastChangeCount[gameId] = 0
  } else {
    lastChangeCount.counting = 0
    lastChangeCount.sentences = 0
    lastChangeCount.letters = 0
  }
}

export function computeNextDifficulty(
  gameId: GameId,
  currentLevel: number,
  minLevel: number,
  maxLevel: number,
  totalRecorded: number,
  config: AdaptiveConfig = DEFAULT_ADAPTIVE_CONFIG
): number {
  // 1. Need at least windowSize observations
  if (totalRecorded < config.windowSize) {
    return currentLevel
  }

  // 2. Cooldown check: prevent oscillation by requiring fresh observations
  if (totalRecorded - lastChangeCount[gameId] < config.cooldownObservations) {
    return currentLevel
  }

  const recent = getRecentObservations(gameId, config.windowSize)
  if (recent.length < config.windowSize) {
    return currentLevel
  }

  // Count first attempt successes without hint
  const successCount = recent.filter(
    (obs: QuestionObservation) => obs.firstAttemptSuccess && !obs.hintUsed
  ).length

  let nextLevel = currentLevel

  if (successCount >= config.promoteThreshold && currentLevel < maxLevel) {
    nextLevel = currentLevel + 1
    lastChangeCount[gameId] = totalRecorded
  } else if (successCount <= config.demoteThreshold && currentLevel > minLevel) {
    nextLevel = currentLevel - 1
    lastChangeCount[gameId] = totalRecorded
  }

  return nextLevel
}
