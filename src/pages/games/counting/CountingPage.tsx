import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useGameSession } from '../../../hooks/useGameSession'
import {
  generateCountingQuestion,
  BASIC_CONFIG,
  EXPANDED_CONFIG,
} from './countingGenerator'
import type { CountingQuestion } from '../../../engine/questionTypes'

function generateQ(level: number) {
  const config = level >= 2 ? EXPANDED_CONFIG : BASIC_CONFIG
  return generateCountingQuestion(config)
}

export default function CountingPage() {
  const stableGenerate = useCallback(generateQ, [])
  const {
    question,
    score,
    feedback,
    attempts,
    wrongSelections,
    submitAnswer,
    nextQuestion,
    restart,
  } = useGameSession<CountingQuestion>('counting', 1, 1, 2, stableGenerate)

  const { count, objectName, emoji, options, correct } = question
  const isFinished = feedback === 'correct' || feedback === 'revealed'

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-between sm:justify-center p-3 sm:p-6 lg:p-8 2xl:p-14 gap-3 sm:gap-6 2xl:gap-10 transition-all duration-300">
      {/* Top Bar / Header */}
      <header className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl 2xl:max-w-5xl flex items-center justify-between">
        <Link
          to="/"
          className="rounded-full bg-white px-3 sm:px-5 2xl:px-8 py-1.5 sm:py-2.5 2xl:py-4 text-sm sm:text-base 2xl:text-2xl font-bold text-green-700 shadow-sm hover:shadow-md active:scale-95 transition-all"
        >
          ← Beranda
        </Link>
        <h1 className="text-base sm:text-2xl 2xl:text-4xl font-black text-green-800 tracking-tight">
          🔢 Hitung Angka
        </h1>
        <button
          onClick={restart}
          className="rounded-full bg-white px-3 sm:px-5 2xl:px-8 py-1.5 sm:py-2.5 2xl:py-4 text-sm sm:text-base 2xl:text-2xl font-bold text-green-700 shadow-sm hover:shadow-md active:scale-95 transition-all"
        >
          Ulang
        </button>
      </header>

      {/* Score Badge */}
      <div className="text-sm sm:text-xl 2xl:text-3xl font-extrabold text-green-800 bg-white/80 px-4 sm:px-6 2xl:px-10 py-1 sm:py-2 2xl:py-3.5 rounded-full shadow-sm">
        ⭐ Skor: {score}
      </div>

      {/* Question Card */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl 2xl:max-w-5xl bg-white rounded-3xl 2xl:rounded-[2.5rem] shadow-md p-4 sm:p-8 2xl:p-12 flex flex-col items-center gap-2 sm:gap-4 2xl:gap-8">
        <p className="text-lg sm:text-2xl md:text-3xl 2xl:text-5xl font-black text-gray-800 text-center">
          Ada berapa <span className="text-green-700">{objectName}</span>?
        </p>

        {/* Fruit items display */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 2xl:gap-6 py-2 sm:py-4 2xl:py-8 min-h-[90px] sm:min-h-[140px] 2xl:min-h-[220px]">
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className="text-4xl sm:text-6xl md:text-7xl 2xl:text-9xl leading-none select-none transition-transform duration-200"
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 2xl:gap-8 w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl 2xl:max-w-5xl">
        {options.map((opt) => {
          const isCorrectOpt = opt === correct
          const isWrongChosen = wrongSelections.includes(opt)

          let btnClass =
            'rounded-2xl 2xl:rounded-3xl py-3.5 sm:py-6 2xl:py-10 text-2xl sm:text-4xl 2xl:text-6xl font-black shadow-md transition-all duration-200 '

          if (isFinished) {
            if (isCorrectOpt) {
              btnClass += 'bg-green-500 text-white scale-105 shadow-xl ring-4 ring-green-300'
            } else {
              btnClass += 'bg-gray-100 text-gray-300 opacity-40'
            }
          } else {
            if (isWrongChosen) {
              btnClass += 'bg-red-50 text-red-300 opacity-50 cursor-not-allowed border-2 border-red-100'
            } else {
              btnClass += 'bg-white text-gray-800 hover:bg-green-100 hover:shadow-lg active:scale-95'
            }
          }

          return (
            <button
              key={opt}
              onClick={() => submitAnswer(opt, isCorrectOpt)}
              disabled={isFinished || isWrongChosen}
              className={btnClass}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Feedback & Navigation Area */}
      <div className="min-h-[70px] sm:min-h-[90px] 2xl:min-h-[130px] flex flex-col items-center justify-center gap-2 sm:gap-3 2xl:gap-5 text-center px-4 w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl 2xl:max-w-5xl">
        {feedback === 'correct' && (
          <>
            <p className="text-lg sm:text-2xl 2xl:text-4xl font-black text-green-600 animate-bounce">
              🎉 Benar! Bagus sekali!
            </p>
            <button
              onClick={nextQuestion}
              className="rounded-full bg-green-500 hover:bg-green-600 px-6 sm:px-10 2xl:px-16 py-2.5 sm:py-4 2xl:py-6 text-white font-extrabold text-base sm:text-xl 2xl:text-3xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              Soal Berikutnya →
            </button>
          </>
        )}

        {feedback === 'wrong' && (
          <p className="text-base sm:text-xl 2xl:text-3xl font-extrabold text-orange-500">
            🤔 Belum tepat, yuk coba hitung lagi! (Pilihan ke-{attempts} dari 3)
          </p>
        )}

        {feedback === 'revealed' && (
          <>
            <p className="text-base sm:text-xl 2xl:text-3xl font-extrabold text-amber-800">
              💡 Tidak apa-apa! Jumlah {objectName} ada{' '}
              <span className="text-green-700 underline">{correct}</span>.
            </p>
            <button
              onClick={nextQuestion}
              className="rounded-full bg-green-500 hover:bg-green-600 px-6 sm:px-10 2xl:px-16 py-2.5 sm:py-4 2xl:py-6 text-white font-extrabold text-base sm:text-xl 2xl:text-3xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              Soal Berikutnya →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
