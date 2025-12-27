import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import LoadingSpinner from '../ui/LoadingSpinner';
import { fetchQuizQuestions, saveQuizResults } from '../../services/quizAPI';
import './QuizSession.css';

const QuizSession = ({ config = {} }) => {
  const { language = 'spanish', type = 'vocabulary' } = useParams();
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
      const questions = await fetchQuizQuestions(language, type);
      setQuizState(prev => ({
        ...prev,
        questions,
        status: 'active'
      }));
    } catch (error) {
      console.error('Failed to load questions:', error);
      setQuizState(prev => ({
        ...prev,
        questions: getFallbackQuestions(),
        status: 'active'
      }));
    }
  };

  const handleAnswerSelect = (selectedAnswer) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setQuizState(prev => {
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      const newUserAnswers = [...prev.userAnswers, {
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
        correctAnswer: currentQuestion.correctAnswer,
        question: currentQuestion.question,
        audioText: currentQuestion.audioText
      }];
      
      const isLastQuestion = prev.currentQuestionIndex === prev.questions.length - 1;
      
      if (isLastQuestion) {
        // Save results when quiz ends
        saveQuizResults(language, type, newScore, prev.questions.length);
        
        return {
          ...prev,
          score: newScore,
          userAnswers: newUserAnswers,
          status: 'finished'
        };
      }
      
      return {
        ...prev,
        score: newScore,
        userAnswers: newUserAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      };
    });
  };

  // ... rest of the file remains similar, just update the title to include type
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