// ponytail: session hook with elimination-aware reveal & adaptive difficulty tracking
import { useState, useCallback, useRef } from 'react'
import { recordObservation, resetTracker } from '../engine/performanceTracker'
import { computeNextDifficulty, resetAdaptiveState, type AdaptiveConfig, DEFAULT_ADAPTIVE_CONFIG } from '../engine/adaptiveDifficulty'
import type { GameId } from '../engine/questionTypes'

export type FeedbackState = 'none' | 'correct' | 'wrong' | 'revealed'

export function useGameSession<Q>(
  gameId: GameId,
  initialLevel: number,
  minLevel: number,
  maxLevel: number,
  generateQuestion: (level: number) => Q,
  getSkill?: (question: Q) => string,
  adaptiveConfig: AdaptiveConfig = DEFAULT_ADAPTIVE_CONFIG,
  maxMistakesBeforeReveal = 2
) {
  const [level, setLevel] = useState(initialLevel)
  const levelRef = useRef(initialLevel)
  levelRef.current = level

  const totalCompletedRef = useRef(0)
  const hintUsedRef = useRef(false)

  const [question, setQuestion] = useState<Q>(() => generateQuestion(initialLevel))
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>('none')
  const [attempts, setAttempts] = useState(0)
  const [wrongSelections, setWrongSelections] = useState<(string | number)[]>([])
  const [hintVisible, setHintVisible] = useState(false)

  const showHint = useCallback(() => {
    hintUsedRef.current = true
    setHintVisible(true)
  }, [])

  const submitAnswer = useCallback(
    (selectedOption: string | number, isCorrect: boolean) => {
      // Disallow clicking after correct or revealed (single completion guarantee)
      if (feedback === 'correct' || feedback === 'revealed') return

      const currentAttempts = attempts
      const nextAttempts = currentAttempts + 1
      setAttempts(nextAttempts)

      if (isCorrect) {
        setFeedback('correct')
        setScore((s) => s + 1)
        totalCompletedRef.current += 1

        const isFirstAttempt = currentAttempts === 0
        const skill = getSkill ? getSkill(question) : gameId

        recordObservation({
          gameId,
          skill,
          firstAttemptSuccess: isFirstAttempt,
          attempts: nextAttempts,
          hintUsed: hintUsedRef.current,
          completed: true,
        })

        const nextLvl = computeNextDifficulty(
          gameId,
          levelRef.current,
          minLevel,
          maxLevel,
          totalCompletedRef.current,
          adaptiveConfig
        )
        if (nextLvl !== levelRef.current) {
          setLevel(nextLvl)
          levelRef.current = nextLvl
        }
      } else {
        const updatedWrong = [...wrongSelections, selectedOption]
        setWrongSelections(updatedWrong)

        // For a 3-choice game, 2 incorrect choices leave only 1 possible choice.
        // At that point, reveal the correct answer to prevent pointless guessing.
        if (updatedWrong.length >= maxMistakesBeforeReveal) {
          setFeedback('revealed')
          totalCompletedRef.current += 1

          const skill = getSkill ? getSkill(question) : gameId
          recordObservation({
            gameId,
            skill,
            firstAttemptSuccess: false,
            attempts: nextAttempts,
            hintUsed: hintUsedRef.current,
            completed: true,
          })

          const nextLvl = computeNextDifficulty(
            gameId,
            levelRef.current,
            minLevel,
            maxLevel,
            totalCompletedRef.current,
            adaptiveConfig
          )
          if (nextLvl !== levelRef.current) {
            setLevel(nextLvl)
            levelRef.current = nextLvl
          }
        } else {
          setFeedback('wrong')
        }
      }
    },
    [feedback, attempts, wrongSelections, question, gameId, minLevel, maxLevel, getSkill, adaptiveConfig, maxMistakesBeforeReveal]
  )

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(levelRef.current))
    setFeedback('none')
    setAttempts(0)
    setWrongSelections([])
    hintUsedRef.current = false
    setHintVisible(false)
  }, [generateQuestion])

  const restart = useCallback(() => {
    resetTracker(gameId)
    resetAdaptiveState(gameId)
    totalCompletedRef.current = 0
    setLevel(initialLevel)
    levelRef.current = initialLevel
    setQuestion(generateQuestion(initialLevel))
    setScore(0)
    setFeedback('none')
    setAttempts(0)
    setWrongSelections([])
    hintUsedRef.current = false
    setHintVisible(false)
  }, [gameId, initialLevel, generateQuestion])

  return {
    question,
    score,
    feedback,
    attempts,
    wrongSelections,
    hintVisible,
    showHint,
    submitAnswer,
    nextQuestion,
    restart,
  }
}
