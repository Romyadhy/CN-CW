import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import HomePage from './pages/HomePage'
import CountingPage from './pages/games/counting/CountingPage'
import SentencesPage from './pages/games/sentences/SentencesPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/counting" element={<CountingPage />} />
        <Route path="/sentences" element={<SentencesPage />} />
      </Routes>
      <Analytics />
    </>
  )
}
