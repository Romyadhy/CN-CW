<div align="center">

# CN-CW

**Calculated Number & Complete Word**  
_A lightweight, zero-overhead educational platform for early childhood learning._

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg?style=flat-square)](./test/verify.ts)

<br />

[Quick Start](#-quick-start) • [Core Games](#-core-games) • [Architecture](#-architecture) • [Engine Highlights](#-engine-highlights) • [Documentation](#-documentation)

<br />

</div>

---

## 📌 Overview

**CN-CW** is a client-side Single Page Application (SPA) designed to foster foundational numeracy and language comprehension in young children (_PAUD / TK_). Built around an evidence-based **zero-penalty pedagogical framework**, the system eliminates artificial timers, score penalties, and overt level gates—enabling stress-free, self-paced mastery.

---

## 🎮 Core Games

| Module | Game Mode         | Focus Skill                    | Progression Range                                             | Input Paradigm           |
| :----- | :---------------- | :----------------------------- | :------------------------------------------------------------ | :----------------------- |
| **CN** | **Hitung Angka**  | Numeracy & Object Counting     | 1–5 objects (Basic)<br>1–10 objects (Expanded)                | 3-Choice Multiple Choice |
| **CW** | **Lengkapi Kata** | Indonesian Sentence Completion | Vocabulary (L1)<br>Action Verbs (L2)<br>Contextual Logic (L3) | 3-Choice Vocabulary Fill |

---

<!-- ## ⚡ Engine Highlights -->
<!---->
<!-- ### 1. Invisible Adaptive Engine -->
<!---->
<!-- The platform automatically monitors child competence without exposing stressful level numbers or progression barriers: -->
<!---->
<!-- - **Rolling Window**: Analyzes rolling batches of 8 completed questions. -->
<!-- - **Promotion**: Advances when $\ge 7 / 8$ questions are solved correctly on the first attempt without hints. -->
<!-- - **Demotion**: Gently reduces complexity if $\le 4 / 8$ first-attempt accuracy is observed. -->
<!-- - **Anti-Oscillation Cooldown**: Enforces an 8-observation observation buffer before allowing subsequent adjustments. -->
<!-- - **Domain Independence**: Numeracy and vocabulary progress track independently with zero cross-game performance leakage. -->
<!---->
<!-- ### 2. 3-Attempt Secret-Answer Protection -->
<!---->
<!-- To cultivate genuine problem-solving rather than rote guessing: -->
<!---->
<!-- - **Attempts 1–2**: Wrong options are gently disabled (muted red), leaving remaining possibilities active while keeping the correct answer hidden. -->
<!-- - **Attempt 3 (Auto-Reveal)**: If unresolved after 3 tries, the system warmly reveals the correct answer and displays a friendly continue prompt to prevent frustration. -->
<!---->
<!-- ### 3. Responsive Proportional Scaling -->
<!---->
<!-- Custom-engineered layouts optimized across diverse hardware environments: -->
<!---->
<!-- - **Mobile (`< 640px`)**: Thumb-first vertical stacking, compact padding, zero-scroll containment. -->
<!-- - **Laptop & Desktop (`768px – 1080p`)**: Proportional card geometry with interactive hover transitions. -->
<!-- - **Large Classroom Displays / 4K TVs (`≥ 1536px`)**: Jumbo typography (`text-6xl`), high-visibility buttons (`py-10`), and expansive counting targets (`text-9xl`) visible across a classroom. -->
<!---->
<!-- --- -->

<!-- ## 🏛️ Architecture & Session Flow -->
<!---->
<!-- ```mermaid -->
<!-- flowchart TD -->
<!--     Start([User Selects Game]) --> Init[Load Game Session] -->
<!--     Init --> Gen[Question Generator] -->
<!---->
<!--     subgraph Generator Layer -->
<!--         Gen --> AntiRep[Anti-Repetition Filter] -->
<!--         AntiRep --> DiffFilter[Apply Difficulty Bounds] -->
<!--         DiffFilter --> Shuffle[Fisher-Yates 3-Way Shuffle] -->
<!--     end -->
<!---->
<!--     Shuffle --> Render[Display Interactive Card] -->
<!--     Render --> Answer{Child Submits Answer} -->
<!---->
<!--     Answer -->|Correct| Success[Score +1 & Celebration State] -->
<!--     Answer -->|Wrong: Attempt 1 or 2| Retry[Disable Wrong Option & Prompt Retry] -->
<!--     Answer -->|Wrong: Attempt 3| Reveal[Auto-Reveal Correct Answer] -->
<!---->
<!--     Retry --> Answer -->
<!--     Success --> Tracker[Record Session Observation] -->
<!--     Reveal --> Tracker -->
<!---->
<!--     subgraph Adaptive Engine -->
<!--         Tracker --> WindowCheck{Window >= 8 & Cooldown Clear?} -->
<!--         WindowCheck -->|Yes: >= 7/8 Correct| Promote[Advance Difficulty] -->
<!--         WindowCheck -->|Yes: <= 4/8 Correct| Demote[Lower Difficulty] -->
<!--         WindowCheck -->|No / Intermediate| Retain[Retain Level] -->
<!--     end -->
<!---->
<!--     Promote --> NextQ[Load Next Question] -->
<!--     Demote --> NextQ -->
<!--     Retain --> NextQ -->
<!--     NextQ --> Gen -->
<!-- ``` -->
<!---->
<!-- --- -->

## 🚀 Quick Start

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cncw.git
cd cncw

# Install dependencies
npm install
```

### Development

Start the local Vite dev server with hot module replacement:

```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

### Verification & Testing

Execute the test suite covering generators, bank integrity, boundary checks, and adaptive state machine behavior:

```bash
npm test
```

### Production Build

Typecheck and generate an optimized static production bundle in `dist/`:

```bash
npm run build
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
