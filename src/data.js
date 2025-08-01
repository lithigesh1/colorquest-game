/**
 * ColorQuest Game Data Module
 * Contains static questions data and shuffling utilities
 * Provides dynamic question generation for randomized gameplay
 */

// ==================== STATIC GAME DATA ====================

// Static questions database - contains all color matching questions
// Each question has a color and 3 options (1 correct, 2 incorrect)
const staticQuestions = [
  {
    color: "red",                                             // Target color to match
    options: [
      { label: "Apple", image: "/images/apple.png", isCorrect: true },      // Correct answer
      { label: "Banana", image: "/images/banana.png", isCorrect: false },   // Distractor
      { label: "Sky", image: "/images/sky.png", isCorrect: false },         // Distractor
    ],
  },
  {
    color: "blue",
    options: [
      { label: "Sky", image: "/images/sky.png", isCorrect: true },
      { label: "Lemon", image: "/images/lemon.png", isCorrect: false },
      { label: "Tomato", image: "/images/tomato.png", isCorrect: false },
    ],
  },
  {
    color: "green",
    options: [
      { label: "Leaf", image: "/images/leaf.png", isCorrect: true },
      { label: "Sun", image: "/images/sun.png", isCorrect: false },
      { label: "Strawberry", image: "/images/strawberry.png", isCorrect: false },
    ],
  },
  {
    color: "yellow",
    options: [
      { label: "Banana", image: "/images/banana.png", isCorrect: true },
      { label: "Grapes", image: "/images/grapes.png", isCorrect: false },
      { label: "Cherry", image: "/images/cherry.png", isCorrect: false },
    ],
  },
  {
    color: "orange",
    options: [
      { label: "Carrot", image: "/images/carrot.png", isCorrect: true },
      { label: "Eggplant", image: "/images/eggplant.png", isCorrect: false },
      { label: "Broccoli", image: "/images/broccoli.png", isCorrect: false },
    ],
  },
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Fisher-Yates shuffle algorithm implementation
 * Provides true random shuffling without bias
 * @param {Array} array - The array to shuffle
 * @returns {Array} - A new shuffled array (original unchanged)
 */
const shuffleArray = (array) => {
  const shuffled = [...array];                               // Create copy to avoid mutating original
  
  // Fisher-Yates shuffle: iterate backwards through array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));          // Random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  
  return shuffled;
};

// ==================== MAIN EXPORT FUNCTION ====================

/**
 * Generate shuffled questions for a new game session
 * Creates randomized question order and option arrangements
 * @returns {Array} - Array of questions with shuffled order and options
 */
const getShuffledQuestions = () => {
  // Step 1: Shuffle the order of questions
  // This ensures different question sequences each game
  const shuffledQuestions = shuffleArray(staticQuestions);
  
  // Step 2: Shuffle options within each question
  // This prevents players from memorizing answer positions
  return shuffledQuestions.map(question => ({
    ...question,                                             // Preserve question properties
    options: shuffleArray(question.options)                 // Shuffle answer options
  }));
};

// ==================== MODULE EXPORTS ====================

// Export the dynamic question generator as default export
// This function should be called each time a new game starts
export default getShuffledQuestions;
