import React, { useState, useEffect } from 'react';
import './ProgressTracker.css';

const ProgressTracker = () => {
  const [progress, setProgress] = useState({
    spanish: { total: 0, correct: 0 },
    french: { total: 0, correct: 0 },
    german: { total: 0, correct: 0 }
  });

  const [streak, setStreak] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);

  useEffect(() => {
    // Load from localStorage
    const savedProgress = JSON.parse(localStorage.getItem('quizProgress')) || {};
    const savedStreak = localStorage.getItem('quizStreak') || 0;
    const savedTotal = localStorage.getItem('totalQuizzes') || 0;
    
    setProgress(savedProgress);
    setStreak(Number(savedStreak));
    setTotalQuizzes(Number(savedTotal));
  }, []);

  const calculatePercentage = (lang) => {
    const langProgress = progress[lang] || { total: 0, correct: 0 };
    if (langProgress.total === 0) return 0;
    return Math.round((langProgress.correct / langProgress.total) * 100);
  };

  const languages = [
    { code: 'spanish', name: 'Spanish', color: '#3498db' },
    { code: 'french', name: 'French', color: '#2ecc71' },
    { code: 'german', name: 'German', color: '#9b59b6' }
  ];

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h2>Your Progress</h2>
        <div className="stats-summary">
          <div className="stat">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalQuizzes}</span>
            <span className="stat-label">Quizzes Taken</span>
          </div>
        </div>
      </div>

      <div className="language-progress">
        {languages.map((lang) => {
          const percentage = calculatePercentage(lang.code);
          const langProgress = progress[lang.code] || { total: 0, correct: 0 };
          
          return (
            <div key={lang.code} className="progress-item">
              <div className="progress-info">
                <h3>{lang.name}</h3>
                <span className="score">
                  {langProgress.correct}/{langProgress.total} correct
                </span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: lang.color
                  }}
                ></div>
                <span className="percentage">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
