import React, { useState } from 'react';
import AnswerOptions from './AnswerOptions';
import Button from '../ui/Button';
import AudioPlayer from './AudioPlayer';
import './QuizQuestion.css';

const QuizQuestion = ({
  question,
  options,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  audioText,
  language
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  const handleSelect = (answer) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answer);
    setHasAnswered(true);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;
    
    onAnswerSelect(selectedAnswer);
    setSelectedAnswer(null);
    setHasAnswered(false);
  };

  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="quiz-question">
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Question {questionNumber} of {totalQuestions}
        </div>
      </div>
      
      <div className="question-card">
        {audioText && (
          <AudioPlayer text={audioText} language={language} />
        )}
        
        <h3 className="question-text">{question}</h3>
        
        <div className="options-grid">
          <AnswerOptions
            options={options}
            selectedAnswer={selectedAnswer}
            onSelect={handleSelect}
            hasAnswered={hasAnswered}
          />
        </div>
        
        {selectedAnswer && (
          <div className="action-buttons">
            <Button 
              variant="primary"
              onClick={handleNext}
              size="large"
            >
              {questionNumber === totalQuestions ? 'See Results' : 'Next Question →'}
            </Button>
          </div>
        )}
        
        {!selectedAnswer && (
          <div className="instruction">
            <p>Select one answer to continue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;