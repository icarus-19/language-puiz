import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import './QuizResults.css';

const QuizResults = ({ score, totalQuestions, userAnswers, language, quizType }) => {
  const navigate = useNavigate();
  const { type = 'vocabulary' } = useParams();
  
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getResultMessage = () => {
    if (percentage >= 90) return "Excellent! You're a language master! 🎯";
    if (percentage >= 70) return "Great job! You're doing very well! 👍";
    if (percentage >= 50) return "Good effort! Keep practicing! 💪";
    return "Keep learning! You'll get better! 📚";
  };

  const handleRestartSame = () => {
    navigate(0); // Reload current quiz
  };

  const handleTryAnother = () => {
    navigate(`/quiz/${language}`); // Go back to quiz type selection
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="quiz-results">
      <div className="results-header">
        <h2>Quiz Complete!</h2>
        <p className="quiz-info">
          {language.charAt(0).toUpperCase() + language.slice(1)} {quizType} Quiz
        </p>
      </div>
      
      <div className="score-display">
        <div className="score-circle">
          <div className="score-number">{score}<span>/{totalQuestions}</span></div>
          <div className="score-percentage">{percentage}%</div>
        </div>
        <div className="result-message">
          <p>{getResultMessage()}</p>
        </div>
      </div>
      
      <div className="answers-review">
        <h3>Your Answers:</h3>
        <div className="answers-list">
          {userAnswers.map((answer, index) => (
            <div 
              key={answer.questionId} 
              className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="answer-question">
                <span className="question-number">Q{index + 1}:</span>
                {answer.question}
              </div>
              <div className="answer-details">
                <div className="your-answer">
                  <strong>Your answer:</strong> {answer.selectedAnswer}
                </div>
                {!answer.isCorrect && (
                  <div className="correct-answer">
                    <strong>Correct answer:</strong> {answer.correctAnswer}
                  </div>
                )}
                <div className="answer-status">
                  {answer.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="action-buttons">
        <Button 
          variant="primary"
          onClick={handleRestartSame}
          size="large"
        >
          Try Again
        </Button>
        <Button 
          variant="secondary"
          onClick={handleTryAnother}
          size="large"
        >
          Try Another Quiz Type
        </Button>
        <Button 
          variant="secondary"
          onClick={handleBackToHome}
          size="large"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;
