import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '../ui/Button';
import './QuizTypeSelector.css';

const QuizTypeSelector = () => {
  const { language = 'spanish' } = useParams();
  
  const quizTypes = [
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      description: 'Test your word knowledge',
      icon: '📚',
      color: '#3498db'
    },
    {
      id: 'grammar',
      title: 'Grammar',
      description: 'Practice grammar rules',
      icon: '✍️',
      color: '#2ecc71'
    },
    {
      id: 'translation',
      title: 'Translation',
      description: 'Translate sentences',
      icon: '🔤',
      color: '#e74c3c'
    },
    {
      id: 'listening',
      title: 'Listening',
      description: 'Audio comprehension',
      icon: '👂',
      color: '#9b59b6'
    }
  ];

  return (
    <div className="quiz-type-selector">
      <div className="selector-header">
        <h2>Choose Quiz Type</h2>
        <p>Select a quiz type for {language} practice</p>
      </div>
      
      <div className="quiz-types-grid">
        {quizTypes.map((type) => (
          <a 
            key={type.id}
            href={`/quiz/${language}/${type.id}`}
            className="quiz-type-card"
            style={{ '--card-color': type.color }}
          >
            <div className="card-icon">{type.icon}</div>
            <h3>{type.title}</h3>
            <p>{type.description}</p>
            <div className="start-hint">Start →</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuizTypeSelector;
