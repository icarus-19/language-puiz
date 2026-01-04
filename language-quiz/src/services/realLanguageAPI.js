import { auth, db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { apiCache } from './apiCache';

export const fetchWordDefinition = async (word) => {
  const cacheKey = `dictionary-${word}`;
  
  try {
    // Use cached fetch with 1 hour TTL
    const data = await apiCache.cachedFetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      {},
      60 * 60 * 1000 // 1 hour
    );
    
    return data[0];
  } catch (error) {
    console.error('Dictionary API error:', error);
    return null;
  }
};

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error('Word not found');
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Dictionary API error:', error);
    return null;
  }

export const translateText = async (text, targetLang) => {

  const mockTranslations = {
    spanish: {
      'hello': 'hola',
      'goodbye': 'adiós',
      'thank you': 'gracias',
      'please': 'por favor'
    },
    french: {
      'hello': 'bonjour',
      'goodbye': 'au revoir',
      'thank you': 'merci',
      'please': 's\'il vous plaît'
    }
  };

  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockTranslations[targetLang]?.[text.toLowerCase()] || text;
};

// Generate vocabulary questions using dictionary API
export const generateVocabularyQuestions = async (language, count = 5) => {
  const words = ['hello', 'goodbye', 'thank', 'please', 'water', 'food', 'house', 'book', 'friend', 'time'];
  const selectedWords = words.sort(() => 0.5 - Math.random()).slice(0, count);
  
  const questions = [];
  
  for (const word of selectedWords) {
    const definition = await fetchWordDefinition(word);
    
    if (definition) {
      const meanings = definition.meanings?.[0]?.definitions?.[0]?.definition || 'No definition available';
      
      questions.push({
        id: Date.now() + Math.random(),
        question: `What does "${word}" mean?`,
        options: generateOptions(meanings),
        correctAnswer: meanings.substring(0, 50), // First 50 chars
        type: 'vocabulary',
        word: word
      });
    }
  }
  
  return questions;
};

function generateOptions(correctAnswer) {
  const fakeOptions = [
    'A feeling of great happiness',
    'A large body of water',
    'To move quickly',
    'A type of food'
  ];
  
  const options = [correctAnswer.substring(0, 50)];
  
  // Add 3 random fake options
  while (options.length < 4) {
    const randomOption = fakeOptions[Math.floor(Math.random() * fakeOptions.length)];
    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
  }
  
  // Shuffle options
  return options.sort(() => 0.5 - Math.random());
}

// Save quiz results to Firestore
export const saveQuizToFirestore = async (userId, quizData) => {
  try {
    if (!userId) {
      console.warn('No user ID, saving to localStorage instead');
      return saveToLocalStorage(quizData);
    }
    
    const quizRef = collection(db, 'quizResults');
    await addDoc(quizRef, {
      userId,
      ...quizData,
      timestamp: new Date().toISOString()
    });
    
    console.log('Quiz saved to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    // Fallback to localStorage
    return saveToLocalStorage(quizData);
  }
};

// Fallback to localStorage
const saveToLocalStorage = (quizData) => {
  const savedQuizzes = JSON.parse(localStorage.getItem('quizHistory')) || [];
  savedQuizzes.push({
    ...quizData,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('quizHistory', JSON.stringify(savedQuizzes));
  return true;
};

// Fetch user's quiz history
export const getUserQuizHistory = async (userId) => {
  try {
    if (!userId) {
      // Return localStorage data if no user
      return JSON.parse(localStorage.getItem('quizHistory')) || [];
    }
    
    const quizRef = collection(db, 'quizResults');
    const q = query(quizRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    
    return history;
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    return JSON.parse(localStorage.getItem('quizHistory')) || [];
  }
};