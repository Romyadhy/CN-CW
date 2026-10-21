# CN-CW 🧩

> **Calculated Number & Complete Word** — A responsive, adaptive educational mini-game web app designed for early childhood learners (ages 3–6).

---

## 🌟 Overview

**CN-CW** offers a distraction-free, child-friendly learning experience centered around two foundational skills: early numeracy and language comprehension. Built with a zero-penalty philosophy, the app encourages exploration without the pressure of timers, scores deductions, or explicit levels.

---

## ✨ Key Highlights

- **🔢 Calculate Number (CN)**: Interactive object counting with procedurally generated quantities and anti-repetition guards.
- **📖 Complete Word (CW)**: Curated Indonesian sentence-completion exercises spanning vocabulary, action verbs, and contextual thinking.
- **🧠 Invisible Adaptive Difficulty**: Silently adjusts question difficulty based on rolling session performance without exposing stressful level badges or progression gates to the child.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Testing**: [tsx](https://github.com/privatenumber/tsx) + Node Native Assert

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm`

### Installation

```bash
git clone https://github.com/your-username/cncw.git
cd cncw
npm install
```

### Development

Run the local development server with hot-module replacement (HMR):

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Testing

Run automated tests for procedural generators, question banks, and the adaptive difficulty engine:

```bash
npm test
```

### Production Build

Typecheck and bundle optimized static assets into the `dist/` folder:

```bash
npm run build
```

---

## 📄 Project Documentation

- **[ROADMAP_CHECKLIST.md](./ROADMAP_CHECKLIST.md)**: Development checklist, current implementation status, and upcoming feature backlog.
