// Local counting object pool — emoji + Indonesian name + topic
import type { CountingTopic } from '../engine/questionTypes'

export type CountingObject = { name: string; emoji: string; topic: CountingTopic }

const countingObjects: CountingObject[] = [
  // fruit
  { name: 'apel', emoji: '🍎', topic: 'fruit' },
  { name: 'pisang', emoji: '🍌', topic: 'fruit' },
  { name: 'jeruk', emoji: '🍊', topic: 'fruit' },
  { name: 'anggur', emoji: '🍇', topic: 'fruit' },
  { name: 'stroberi', emoji: '🍓', topic: 'fruit' },
  { name: 'semangka', emoji: '🍉', topic: 'fruit' },
  { name: 'mangga', emoji: '🥭', topic: 'fruit' },
  { name: 'nanas', emoji: '🍍', topic: 'fruit' },
  // animal
  { name: 'kucing', emoji: '🐱', topic: 'animal' },
  { name: 'kuda', emoji: '🐴', topic: 'animal' },
  { name: 'ikan', emoji: '🐟', topic: 'animal' },
  { name: 'burung', emoji: '🐦', topic: 'animal' },
  { name: 'bebek', emoji: '🦆', topic: 'animal' },
  { name: 'kupu-kupu', emoji: '🦋', topic: 'animal' },
  // transport
  { name: 'mobil', emoji: '🚗', topic: 'transport' },
  { name: 'bus', emoji: '🚌', topic: 'transport' },
  { name: 'sepeda', emoji: '🚲', topic: 'transport' },
  { name: 'kapal', emoji: '🚢', topic: 'transport' },
  { name: 'pesawat', emoji: '✈️', topic: 'transport' },
  { name: 'kereta', emoji: '🚆', topic: 'transport' },
  // shape
  { name: 'bola', emoji: '🔵', topic: 'shape' },
  { name: 'bintang', emoji: '⭐', topic: 'shape' },
  { name: 'hati', emoji: '❤️', topic: 'shape' },
  { name: 'segitiga', emoji: '🔺', topic: 'shape' },
  { name: 'kotak', emoji: '🟨', topic: 'shape' },
  { name: 'bulan', emoji: '🌙', topic: 'shape' },
  // nature
  { name: 'bunga', emoji: '🌻', topic: 'nature' },
  { name: 'pohon', emoji: '🌳', topic: 'nature' },
  { name: 'awan', emoji: '☁️', topic: 'nature' },
  { name: 'daun', emoji: '🍃', topic: 'nature' },
]

export default countingObjects