import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  fetchQuizQuestions, 
  saveQuizResults 
} from '../../services/quizAPI';
import { 
  generateVocabularyQuestions,
  saveQuizToFirestore 
} from '../../services/realLanguageAPI';
import './QuizSession.css';

const QuizSession = ({ config = {} }) => {
  const { language = 'spanish', type = 'vocabulary' } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [quizState, setQuizState] = useState({
    status: 'loading',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: []
  });

  useEffect(() => {
    loadQuestions();
  }, [language, type]);

  const loadQuestions = async () => {
    try {
      let questions;
      
      // Use real API for vocabulary, mock for others
      if (type === 'vocabulary') {
        questions = await generateVocabularyQuestions(language, 5);
      } else {
        questions = await fetchQuizQuestions(language, type);
      }
      
      setQuizState(prev => ({
        ...prev,
        questions,
        status: 'active'
      }));
    } catch (error) {
      console.error('Failed to load questions:', error);
      // Fallback to mock questions
      setQuizState(prev => ({
        ...prev,
        questions: getFallbackQuestions(),
        status: 'active'
      }));
    }
  };

  const handleAnswerSelect = async (selectedAnswer) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const newUserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      question: currentQuestion.question,
      audioText: currentQuestion.audioText
    };

    const isLastQuestion = quizState.currentQuestionIndex === quizState.questions.length - 1;
    
    if (isLastQuestion) {
      const newScore = isCorrect ? quizState.score + 1 : quizState.score;
      const allAnswers = [...quizState.userAnswers, newUserAnswer];
      
      // Save to Firestore if user is logged in
      if (currentUser) {
        try {
          await saveQuizToFirestore(currentUser.uid, {
            language,
            type,
            score: newScore,
            totalQuestions: quizState.questions.length,
            answers: allAnswers,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error saving to Firestore:', error);
        }
      }
      
      // Also save to localStorage for backward compatibility
      saveQuizResults(language, type, newScore, quizState.questions.length);
      
      setQuizState(prev => ({
        ...prev,
        score: newScore,
        userAnswers: allAnswers,
        status: 'finished'
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        userAnswers: [...prev.userAnswers, newUserAnswer],
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handleRestartQuiz = () => {
    setQuizState({
      status: 'loading',
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: []
    });
    
    setTimeout(() => {
      loadQuestions();
    }, 500);
  };

  const handleBackToQuizzes = () => {
    navigate(`/quiz/${language}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Fallback questions in case API fails
  const getFallbackQuestions = () => {
    return [
      {
        id: 1,
        question: `What is the ${language} word for 'hello'?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        type: type,
        audioText: type === 'listening' ? "Hello" : null
      },
      {
        id: 2,
        question: `Translate to ${language}: 'Thank you'`,
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: "Option 2",
        type: type,
        audioText: type === 'listening' ? "Thank you" : null
      },
      {
        id: 3,
        question: `Choose the correct ${language} grammar`,
        options: ["Choice A", "Choice B", "Choice C", "Choice D"],
        correctAnswer: "Choice C",
        type: type
      }
    ];
  };

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const quizType = type.charAt(0).toUpperCase() + type.slice(1);

  if (quizState.status === 'loading') {
    return (
      <div className="quiz-loading">
        <LoadingSpinner />
        <p>Loading {language} {quizType} Quiz...</p>
      </div>
    );
  }

  if (quizState.status === 'finished') {
    return (
      <QuizResults
        score={quizState.score}
        totalQuestions={quizState.questions.length}
        userAnswers={quizState.userAnswers}
        language={language}
        quizType={quizType}
        onRestart={handleRestartQuiz}
        onBackToQuizzes={handleBackToQuizzes}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return (
    <div className="quiz-session">
      <div className="quiz-header">
        <h2>{language.charAt(0).toUpperCase() + language.slice(1)} {quizType} Quiz</h2>
        <div className="quiz-progress">
          <span className="question-counter">
            Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
          </span>
          <span className="score">
            Score: {quizState.score}
          </span>
        </div>
      </div>
      
      {currentQuestion.audioText && (
        <div className="audio-note">
          <span>🔊 This question includes audio</span>
        </div>
      )}
      
      <QuizQuestion
        question={currentQuestion.question}
        options={currentQuestion.options}
        questionNumber={quizState.currentQuestionIndex + 1}
        totalQuestions={quizState.questions.length}
        onAnswerSelect={handleAnswerSelect}
        audioText={currentQuestion.audioText}
        language={language}
      />
    </div>
  );
};

export default QuizSession;