// ponytail: session hook with 3-attempt retry & adaptive difficulty tracking
import { useState, useCallback, useRef } from 'react'
import { recordObservation, resetTracker } from '../engine/performanceTracker'
import { computeNextDifficulty, resetAdaptiveState } from '../engine/adaptiveDifficulty'

export type FeedbackState = 'none' | 'correct' | 'wrong' | 'revealed'

export function useGameSession<Q>(
  gameId: 'counting' | 'sentences',
  initialLevel: number,
  minLevel: number,
  maxLevel: number,
  generateQuestion: (level: number, lastQuestion?: Q) => Q,
  getSkill?: (question: Q) => string
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
      // Disallow clicking after correct or revealed
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
          totalCompletedRef.current
        )
        if (nextLvl !== levelRef.current) {
          setLevel(nextLvl)
          levelRef.current = nextLvl
        }
      } else {
        setWrongSelections((prev) => [...prev, selectedOption])

        // After 3 failed attempts, reveal the correct answer
        if (nextAttempts >= 3) {
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
            totalCompletedRef.current
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
    [feedback, attempts, question, gameId, minLevel, maxLevel, getSkill]
  )

  const nextQuestion = useCallback(() => {
    setQuestion((prev) => generateQuestion(levelRef.current, prev))
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
