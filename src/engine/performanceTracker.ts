// ponytail: simple in-memory session performance tracker
import type { QuestionObservation, GameId } from './questionTypes'

const history: Record<GameId, QuestionObservation[]> = {
  counting: [],
  sentences: [],
  letters: [],
}

export function recordObservation(observation: QuestionObservation): void {
  // Only record completed questions as per spec
  if (!observation.completed) return
  history[observation.gameId].push(observation)
}

export function getRecentObservations(
  gameId: GameId,
  limit = 8
): QuestionObservation[] {
  return history[gameId].slice(-limit)
}

export function resetTracker(gameId?: GameId): void {
  if (gameId) {
    history[gameId] = []
  } else {
    history.counting = []
    history.sentences = []
    history.letters = []
  }
}
