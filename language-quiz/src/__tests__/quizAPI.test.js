import { fetchQuizQuestions, saveQuizResults } from '../services/quizAPI';

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: jest.fn(key => localStorageMock.store[key]),
  setItem: jest.fn((key, value) => {
    localStorageMock.store[key] = value;
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  })
};

global.localStorage = localStorageMock;

describe('quizAPI Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('fetchQuizQuestions returns questions', async () => {
    const questions = await fetchQuizQuestions('spanish');
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toHaveProperty('question');
    expect(questions[0]).toHaveProperty('options');
    expect(questions[0]).toHaveProperty('correctAnswer');
  });

  test('saveQuizResults saves to localStorage', () => {
    saveQuizResults('spanish', 'vocabulary', 8, 10);
    
    const progress = JSON.parse(localStorage.getItem('quizProgress'));
    expect(progress.spanish).toBeDefined();
    expect(progress.spanish.total).toBe(10);
    expect(progress.spanish.correct).toBe(8);
  });

  test('saveQuizResults increments streak', () => {
    // First save
    saveQuizResults('spanish', 'vocabulary', 8, 10);
    let streak = localStorage.getItem('quizStreak');
    expect(parseInt(streak)).toBe(1);
    
    // Second save (same day shouldn't increment)
    localStorage.setItem('lastQuizDate', new Date().toDateString());
    saveQuizResults('french', 'vocabulary', 9, 10);
    streak = localStorage.getItem('quizStreak');
    expect(parseInt(streak)).toBe(1);
  });
});
