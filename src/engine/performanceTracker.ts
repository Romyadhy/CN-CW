// ponytail: simple in-memory session performance tracker
import type { QuestionObservation } from './questionTypes'

const history: Record<'counting' | 'sentences', QuestionObservation[]> = {
  counting: [],
  sentences: [],
}

export function recordObservation(observation: QuestionObservation): void {
  // Only record completed questions as per spec
  if (!observation.completed) return
  history[observation.gameId].push(observation)
}

export function getRecentObservations(
  gameId: 'counting' | 'sentences',
  limit = 8
): QuestionObservation[] {
  return history[gameId].slice(-limit)
}

export function resetTracker(gameId?: 'counting' | 'sentences'): void {
  if (gameId) {
    history[gameId] = []
  } else {
    history.counting = []
    history.sentences = []
  }
}
