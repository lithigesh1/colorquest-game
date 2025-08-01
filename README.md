# ColorQuest Game

**ColorQuest** is an interactive color-matching game built with React and Vite. Players match displayed colors with corresponding objects in a dark-themed interface.

## Features

### Gameplay
- Color matching with shuffled questions
- Real-time visual feedback
- Automatic question progression and scoring

### UI/UX
- Dark theme with blue accents
- Responsive, single-page layout
- Smooth transitions and error handling

### Data
- Persistent history with `localStorage`
- Last 10 game sessions saved
- Score-based feedback messages

### Visuals
- Glassmorphism style
- Canvas color rendering
- Animated progress and hover effects

## Tech Stack

- **React 19**, **Vite 7**, **Tailwind CSS 4**
- **JavaScript (ES6+)**
- **Canvas API**, **localStorage API**

## Project Structure

colorquest-game/
├── src/
│   ├── components/        # Game and Start screens
│   ├── data.js            # Question set and shuffle logic
│   ├── App.jsx, main.jsx, index.css
├── public/
│   └── vite.svg
├── package.json, vite.config.js, tailwind.config.js

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Steps

git clone [repository-url]
cd colorquest-game
npm install
npm run dev

Visit: `http://localhost:5173`

### Scripts

* `npm run dev` – Start dev server
* `npm run build` – Build for production
* `npm run preview` – Preview production
* `npm run lint` – Run ESLint checks

## Game Logic

* Fisher-Yates shuffle for randomness
* Each question: one color, three options
* Correct = +1 point; incorrect shows answer
* Final score as percentage with rating messages

## Components

* **GameScreen** – Game logic, color rendering, scoring
* **StartScreen** – Welcome UI, history view
* **data.js** – Shuffling and question data

## Developer Notes

* Modular structure with JSDoc
* ESLint for quality
* React hooks for state
* Lazy loading and minimal bundle size

## Customization

* Add questions in `data.js`
* Change styles in `index.css` or Tailwind config
* Extend with timers, sound, multiplayer, etc.

