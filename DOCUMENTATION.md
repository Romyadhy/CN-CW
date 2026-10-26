# CN-CL-CW Documentation

## Project
CN-CL-CW — Calculated Number, Complete Letter & Complete Word. SPA (React 19 + TypeScript + Vite + Tailwind v4 + React Router v7). Zero-penalty educational games for ages ~3–6.

## Routes
- `/` — Home (3 game cards: /counting, /sentences, /letters)
- `/counting` — Counting objects (CN), pool 30 items
- `/sentences` — Sentence completion (CW), bank 90 items
- `/letters` — Missing letter (CL), bank 90 items

## File Structure (key)
```
src/
  App.tsx                  Routes
  pages/HomePage.tsx       Game cards
  pages/games/counting/   Generator + page
  pages/games/sentences/  Bank (90) + validator + generator + page
  pages/games/letters/    Bank (90) + validator + generator + page
  engine/
    questionTypes.ts        Shared types (GameId, all question types, topic unions)
    deck.ts                 Shared shuffled-deck selection (all 3 games)
    shuffle.ts              Shared Fisher–Yates shuffle
    bankValidator.ts        Spec-driven bank validation (unique IDs, 3 options, topic guard)
    adaptiveDifficulty.ts  Window config (default / letters)
    performanceTracker.ts  Observations + reset
  hooks/useGameSession.ts  Session state, reveal after maxMistakes, score +1 once
  data/                     countingObjects.ts (pool 30, topic-tagged)
test/verify.ts             Assertions: primitives, generators, banks, adaptive, letter deck
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
npm test        # verify.ts — primitives, generators, banks, adaptive, deck, anti-repeat
npm run build   # tsc + vite
npm run dev     # localhost:5173
```

## Key Design Decisions (lazy / ponytail)
- Reused `useGameSession` for all 3 games; only config changes (`adaptiveConfig`, `maxMistakesBeforeReveal`).
- One shared `deck.ts` for shuffled-deck selection in all 3 games; `reset{Counting,Sentence,Letter}Deck()` called on restart.
- One shared `shuffle.ts` — no generator owns its own Fisher–Yates copy.
- Sentence bank validator + letter-bank validator both built on `bankValidator.ts` spec.
- `RawLetterItem`/`LetterQuestion` live in `engine/questionTypes.ts`; `letterTypes.ts` removed.
- Bank `options` stay hand-curated (quality matters) instead of generated.
- No TTS / sound / backend / auth added (backlog per plan2.md / roadmap).

## Limitations / Assumptions
- `displayWord` is derived in the letter generator, never stored in the bank.
- Images are emoji/icons (`image?: string`); no external assets loaded.
- Letter bank intentionally reuses some words with a different blank (e.g. `SEP_TU` vs `SEP_T_U`);
  the duplicate-prompt check compares the blanked word, not the raw word.
