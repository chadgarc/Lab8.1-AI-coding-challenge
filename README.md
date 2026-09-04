# 🃏 Flashcards App — AI Coding Challenge (Lab 8.1)

An interactive, modern flashcard study and quiz application built for developers, students, and lifelong learners. Designed and developed as part of the **Per Scholas Lab 8.1 AI Coding Challenge**, leveraging AI coding assistants (GitHub Copilot) while critically auditing, debugging, and refactoring the output.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.7-5A0EF8?logo=daisyui&logoColor=white)](https://daisyui.com/)
[![React Compiler](https://img.shields.io/badge/React_Compiler-Enabled-087EA4)](https://react.dev/learn/react-compiler)

---

## 📌 Lab Scenario & Objectives

- **Goal:** Build a robust, accessible browser-based Flashcards Study App with persistent storage, card flipping animations, deck/card CRUD, and focused learning modes in 2 hours.
- **Approach:** Use AI coding assistants to quickly scaffold non-trivial features while actively reviewing, refining, and fixing inconsistencies or bugs in AI-generated code.
- **Repository:** [https://github.com/chadgarc/Lab8.1-AI-coding-challenge](https://github.com/chadgarc/Lab8.1-AI-coding-challenge)

### Requirements Checklist

- [x] **Multi-deck support:** Supports unlimited decks, each containing cards with front and back text.
- [x] **Deck CRUD:** Create, select, reorder, and persist decks.
- [x] **Card CRUD:** Add new cards with validation, edit prompt/definition, delete cards with confirmation, and drag-and-drop reorder.
- [x] **Study Mode:** Dedicated full-screen focused mode with 3D flip card animations, sequential navigation, and review marking.
- [x] **Test / Quiz Mode (Stretch Goal):** Practice with customizable question counts, test direction (Term ➔ Definition or vice versa), and multiple question types (True/False, Multiple Choice, Matching).
- [x] **Data Persistence:** Automatic synchronization to browser `localStorage` for all decks, cards, and review statuses.
- [x] **Responsive & Accessible UI:** Semantic HTML elements, accessible labels (`aria-label`), keyboard-accessible dialogs, and mobile-ready layouts.

---

## 🧠 Reflection on AI-Assisted Development

As required by the lab challenge rubric, here is the critical analysis of the AI-assisted development workflow:

1. **Where AI Saved Time:**
   - **Domain Content Generation:** Generating 8 high-quality starter decks covering Web Development, JavaScript, TypeScript, React, Advanced Hooks, Bootstrap vs. Tailwind, Docker, and Frontend Interview Questions with concise definitions.
   - **Interactive Component Scaffolding:** Rapidly generating the baseline layout, the complex question-generator logic in `TestMode.tsx`, and the canvas-based interactive grid background.

2. **AI Bug Identified and Fixed:**
   - **Card Flip State Desynchronization:** When navigating between cards (Next / Previous or Autoplay slideshow), the AI initially did not reset the card's flip state. As a result, moving to the next card presented the _back_ (answer) immediately instead of the _front_ (question).
   - **Fix:** Added explicit `setIsCardFlipped(false)` state resets in all card transition handlers (`showPrevious`, `showNext`, manual index clicks, and autoplay timeouts).
   - **Style:** Fixed style incoungruence between study mode and test mode, and button styling.

3. **Code Refactored for Clarity:**
   - **Immutable Card & Deck Reordering:** AI initially suggested mutating arrays in place with `splice()` inside state setters or using messy temporary variables. Refactored into clean, pure immutable updates:

   ```typescript
   // Refactored immutable card reordering in App.tsx
   function reorderCards(fromIndex: number, toIndex: number) {
     setDecks((currentDecks) =>
       currentDecks.map((deck) => {
         if (deck.id !== selectedDeckId) return deck;

         const cards = [...deck.cards];
         const [movedCard] = cards.splice(fromIndex, 1);
         cards.splice(toIndex, 0, movedCard);
         return { ...deck, cards };
       }),
     );
   }
   ```

4. **Accessibility Improvement Added:**
   - **Accessible Controls & Semantic Structure:** Replaced generic clickable `<div>` elements with standard `<button type="button">` elements, added explicit `aria-label` attributes (`"Flip flashcard"`, `"Previous card"`, `"Next card"`, `"Close modal"`, `"Create deck"`), incorporated native `<dialog>` modals with backdrop buttons, and used landmark tags (`<header>`, `<aside>`, `<nav>`, `<main>`).

5. **Prompt Changes That Improved AI Output:**
   - Rather than asking broad prompts like _"make a flashcard app"_, defining the exact TypeScript contracts first (`type Deck`, `type FlashCardData`) and asking for discrete, single-responsibility components (`SideBar`, `DeckSlideshow`, `TestMode`, `StudyMode`) produced much cleaner code, prevented hallucinations, and eliminated repeated boilerplate.

---

## ✨ Features

### 🗂️ Deck Management

- **Preloaded Starter Decks**: Comes packed with comprehensive developer study decks covering:
  - Web Development Basics (HTML, CSS, Flexbox, Grid, a11y)
  - JavaScript Fundamentals
  - TypeScript
  - React Core Concepts
  - Bootstrap vs TailwindCSS
  - React Advanced Hooks
  - Docker Essentials & Commands
  - Frontend Interview Questions
- **Custom Deck Creation**: Add new decks instantly with custom names.
- **Drag-and-Drop Reordering**: Rearrange decks in the sidebar to prioritize your current subjects.
- **Local Persistence**: All created decks, modifications, and study statuses are automatically synced to `localStorage`.

### 🎴 Interactive Flashcard Slideshow

- **Smooth 3D Card Flipping**: Flip between prompt and definition with realistic 3D perspective animations.
- **Slideshow & Autoplay**: Relax and study hands-free with an automated timer that flips and cycles through cards every 3 seconds.
- **Card Management**: Add new cards, edit existing prompts/definitions, and delete cards with confirmation dialogs.
- **Reorder Cards**: Drag and drop cards within a deck to customize review order.
- **Review Flags**: Mark tricky cards with a review status (`!`) so you can revisit them later.

### 📖 Dedicated Study Mode

- Full-screen, distraction-free environment focused entirely on memorization.
- Integrated autoplay, sequential card navigation, and review marking.

### 📝 Dynamic Test Mode

- **Customizable Quizzes**: Select question volume, test direction (Term ➔ Definition, Definition ➔ Term, or Mixed), and question types.
- **Multiple Question Types**:
  - **True or False**: Evaluate whether a stated definition matches the term.
  - **Multiple Choice**: Select the correct answer from randomized options.
  - **Matching**: Pair terms directly with their corresponding definitions.
- **Instant Scoring**: Receive real-time score feedback and performance breakdowns at the end of every quiz.

### 🎨 Visuals & Aesthetics

- Sleek dark theme with glassmorphism, glowing accents, and crisp typography.
- Interactive physics-based canvas background with cursor warp and ripple effects. Got it from [here](https://21st.dev/@satoriui/components/kinetic-grid).
- Fully responsive layout for seamless mobile and desktop study sessions.

---

## 🛠️ Tech Stack

| Technology          | Purpose                                             |
| :------------------ | :-------------------------------------------------- |
| **React 19**        | Component-driven UI architecture                    |
| **TypeScript**      | Strict static type checking and contracts           |
| **Vite 8**          | High-speed frontend tooling and bundler             |
| **Tailwind CSS v4** | Modern utility-first CSS styling engine             |
| **DaisyUI v5**      | Semantic UI component classes and themes            |
| **React Compiler**  | Automatic memoization and compile-time optimization |
| **HTML5 Canvas**    | Custom interactive particle/grid background         |

---

## 📂 Project Structure

```text
├── docs/                      # Production build output (configured for GitHub Pages)
├── public/                    # Static public assets (icons, favicon)
├── src/
│   ├── components/
│   │   ├── FlashCard/
│   │   │   └── FlashCard.tsx  # 3D flippable card component
│   │   ├── layout/
│   │   │   └── Layout.tsx     # Canvas particle/grid background layout
│   │   ├── DeckSlideshow.tsx  # Slideshow controls, card editor, and card list
│   │   ├── SideBar.tsx        # Deck navigation and drag-and-drop sidebar
│   │   ├── StudyMode.tsx      # Fullscreen focused study modal
│   │   └── TestMode.tsx       # Configurable test engine with scoring
│   ├── types.ts               # Type definitions (Deck, FlashCardData)
│   ├── App.tsx                # App state, deck storage, and default seed data
│   ├── index.css              # Global styles, Tailwind imports, keyframe animations
│   └── main.tsx               # Application bootstrap entry point
├── eslint.config.js           # ESLint configuration
├── package.json               # Dependencies and npm scripts
├── tsconfig.json              # TypeScript root configuration
└── vite.config.ts             # Vite configuration with React Compiler preset
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your system. [pnpm](https://pnpm.io/) is recommended as the package manager.

### 1. Clone the Repository

```bash
git clone https://github.com/chadgarc/Lab8.1-AI-coding-challenge.git
cd Lab8.1-AI-coding-challenge
```

### 2. Install Dependencies

Using pnpm:

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

### 3. Start Development Server

```bash
pnpm dev
```

Open your browser and navigate to `http://localhost:5173` (or the port displayed in your terminal).

---

## 📜 Available Scripts

| Command        | Description                                                           |
| :------------- | :-------------------------------------------------------------------- |
| `pnpm dev`     | Starts the Vite development server with Hot Module Replacement (HMR). |
| `pnpm build`   | Compiles TypeScript and builds the production bundle into `./docs`.   |
| `pnpm preview` | Locally serves the production build from `./docs`.                    |
| `pnpm lint`    | Runs ESLint to check for code quality and syntax issues.              |

---

## 🌐 Deployment (GitHub Pages)

The project is pre-configured to output the production build directly into the `./docs` directory using relative paths (`base: './'`).

To deploy to GitHub Pages:

1. Run `pnpm build` to compile the latest version into `./docs`.
2. Commit and push the changes to GitHub:
   ```bash
   git add docs/
   git commit -m "Build: update docs for GitHub Pages"
   git push origin main
   ```
3. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select your main branch and set the folder to `/docs`.
   - Click **Save**.

---

## 📝 License

This project is created as part of the Per Scholas curriculum and is open for educational and personal use.
