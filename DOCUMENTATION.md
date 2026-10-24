# CN-CL-CW Documentation

## Project
CN-CL-CW — Calculated Number, Complete Letter & Complete Word. SPA (React 19 + TypeScript + Vite + Tailwind v4 + React Router v7). Zero-penalty educational games for ages ~3–6.

## Routes
- `/` — Home (3 game cards: /counting, /sentences, /letters)
- `/counting` — Counting objects (CN)
- `/sentences` — Sentence completion (CW), bank 35 items
- `/letters` — Missing letter (CL), bank 30 items

## File Structure (key)
```
src/
  App.tsx                  Routes
  pages/HomePage.tsx       Game cards
  pages/games/counting/   Generator + page
  pages/games/sentences/  Bank (35) + generator + page
  pages/games/letters/    Types, bank (30), validator, generator, page
  engine/
    questionTypes.ts        Shared types (GameId, LetterQuestion, etc.)
    adaptiveDifficulty.ts  Window config (default / letters)
    performanceTracker.ts  Observations + reset
  hooks/useGameSession.ts  Session state, reveal after maxMistakes, score +1 once
  data/                     countingObjects.ts

test/verify.ts             Assertions: generators, banks, adaptive, letter deck
```

## Games & Mechanics
- 3-choice multiple choice, large touch targets, uppercase/emoji display.
- No timers, no lives, no deduction.
- Incorrect answers disable only the selected option; correct answer hidden until 2 wrong (reveal) or correct click.
- Score increases exactly once per completed question; duplicate handling blocked via feedback === 'correct'/'revealed'.
- Adaptive difficulty isolated per gameId (counting / sentences / letters); `letters` uses window 4, promote 4, demote 1, cooldown 4.

## Build / Test
```
npm install
npm test        # verify.ts — generators, banks, adaptive, letter deck, anti-repeat
npm run build   # tsc + vite
npm run dev     # localhost:5173
```

## Key Design Decisions (lazy / ponytail)
- Reused `useGameSession` for all 3 games; only config changes (`adaptiveConfig`, `maxMistakesBeforeReveal`).
- Letter generator uses module-level deck for shuffled-deck exhaustion; `resetLetterDeck()` called on restart.
- Sentence bank expanded to 35 by adding curated items (vocabulary/action/context) instead of rewriting generator.
- No TTS / sound / backend / auth added (backlog per plan2.md / roadmap).

## Limitations / Assumptions
- `lastQuestion` parameter in `generateLetterQuestion` is passed but not actively used for filtering (deck handles previous via `previousId`); sufficient for current anti-repeat.
- Images are emoji/icons (`image?: string`); no external assets loaded.
- Tests use `node:assert` and `tsx`; no extra test framework added.
