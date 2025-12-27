// Enhanced API with different question types
export const fetchQuizQuestions = async (language = 'spanish', type = 'vocabulary') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const allQuestions = {
    spanish: {
      vocabulary: [
        {
          id: 1,
          question: "What is the Spanish word for 'house'?",
          options: ["Casa", "Perro", "Libro", "Mesa"],
          correctAnswer: "Casa",
          type: "vocabulary",
          audioText: "Casa"
        },
        {
          id: 2,
          question: "What does 'libro' mean in English?",
          options: ["Book", "Library", "Paper", "Read"],
          correctAnswer: "Book",
          type: "vocabulary",
          audioText: "Libro"
        }
      ],
      grammar: [
        {
          id: 1,
          question: "Choose the correct article: ___ libro (the book)",
          options: ["El", "La", "Los", "Las"],
          correctAnswer: "El",
          type: "grammar"
        },
        {
          id: 2,
          question: "What is the plural of 'niño'?",
          options: ["Niños", "Niñas", "Niñes", "Niñitos"],
          correctAnswer: "Niños",
          type: "grammar"
        }
      ],
      translation: [
        {
          id: 1,
          question: "Translate to Spanish: 'The cat is sleeping'",
          options: [
            "El gato está durmiendo",
            "El perro está corriendo",
            "El niño está jugando",
            "La casa es grande"
          ],
          correctAnswer: "El gato está durmiendo",
          type: "translation"
        }
      ],
      listening: [
        {
          id: 1,
          question: "Listen to the audio. What word do you hear?",
          options: ["Hola", "Adiós", "Gracias", "Por favor"],
          correctAnswer: "Hola",
          type: "listening",
          audioText: "Hola"
        }
      ]
    },
    french: {
      vocabulary: [
        {
          id: 1,
          question: "What is the French word for 'hello'?",
          options: ["Merci", "Bonjour", "Au revoir", "S'il vous plaît"],
          correctAnswer: "Bonjour",
          type: "vocabulary",
          audioText: "Bonjour"
        }
      ],
      grammar: [
        {
          id: 1,
          question: "What is the feminine form of 'petit'?",
          options: ["Petite", "Petits", "Petites", "Petitesse"],
          correctAnswer: "Petite",
          type: "grammar"
        }
      ]
    }
  };

  // Get questions for the specific language and type
  let questions = [];
  
  if (allQuestions[language] && allQuestions[language][type]) {
    questions = allQuestions[language][type];
  } else if (allQuestions[language]) {
    // Fallback to vocabulary if specific type not found
    questions = allQuestions[language].vocabulary || [];
  } else {
    // Fallback to Spanish vocabulary
    questions = allQuestions.spanish.vocabulary;
  }
  
  // Ensure we always return some questions
  if (questions.length === 0) {
    questions = [
      {
        id: 1,
        question: `What is the ${language} word for 'hello'?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        type: type
      }
    ];
  }
  
  return questions;
};

// Save quiz results to localStorage
export const saveQuizResults = (language, type, score, totalQuestions) => {
  const progressKey = 'quizProgress';
  const streakKey = 'quizStreak';
  const totalKey = 'totalQuizzes';
  
  // Get existing progress
  const progress = JSON.parse(localStorage.getItem(progressKey)) || {};
  
  // Initialize language progress if not exists
  if (!progress[language]) {
    progress[language] = { total: 0, correct: 0 };
  }
  
  // Update progress
  progress[language].total += totalQuestions;
  progress[language].correct += score;
  
  // Save progress
  localStorage.setItem(progressKey, JSON.stringify(progress));
  
  // Update streak (simple version - just increment)
  const currentStreak = parseInt(localStorage.getItem(streakKey)) || 0;
  const today = new Date().toDateString();
  const lastQuizDate = localStorage.getItem('lastQuizDate');
  
  if (lastQuizDate === today) {
    // Already quizzed today, don't increase streak
    localStorage.setItem(streakKey, currentStreak);
  } else {
    localStorage.setItem(streakKey, currentStreak + 1);
    localStorage.setItem('lastQuizDate', today);
  }
  
  // Update total quizzes
  const totalQuizzes = parseInt(localStorage.getItem(totalKey)) || 0;
  localStorage.setItem(totalKey, totalQuizzes + 1);
  
  return { progress, streak: currentStreak + 1 };
};