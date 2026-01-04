import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SpacedRepetitionSystem, FlashcardManager } from '../../services/spacedRepetition';
import Button from '../ui/Button';
import './FlashcardReview.css';

const FlashcardReview = () => {
  const { language = 'spanish' } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, remaining: 0 });
  
  const srs = new SpacedRepetitionSystem();
  const flashcardManager = new FlashcardManager('currentUser');

  useEffect(() => {
    loadFlashcards();
  }, [language]);

  const loadFlashcards = () => {
    const allCards = flashcardManager.getFlashcardsByLanguage(language);
    const dueCards = srs.getDueFlashcards(allCards);
    setFlashcards(dueCards);
    setStats({
      reviewed: 0,
      remaining: dueCards.length
    });
  };

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleRating = async (performance) => {
    if (currentIndex >= flashcards.length) return;
    
    const currentCard = flashcards[currentIndex];
    const nextReview = srs.calculateNextReview(
      currentCard.level || 0,
      performance
    );
    
    const updatedCard = {
      ...currentCard,
      ...nextReview,
      lastReviewed: new Date().toISOString(),
      reviewCount: (currentCard.reviewCount || 0) + 1
    };
    
    flashcardManager.saveFlashcard(updatedCard);
    
    // Move to next card
    if (currentIndex === flashcards.length - 1) {
      // All cards reviewed
      setCurrentIndex(0);
      loadFlashcards(); // Reload to get updated due cards
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
    
    setStats(prev => ({
      reviewed: prev.reviewed + 1,
      remaining: flashcards.length - (currentIndex + 1)
    }));
  };

  const currentCard = flashcards[currentIndex];

  if (flashcards.length === 0) {
    return (
      <div className="flashcard-review empty">
        <div className="empty-state">
          <div className="empty-icon">🎉</div>
          <h3>All Caught Up!</h3>
          <p>No flashcards need review right now. Check back later!</p>
          <Button 
            variant="primary"
            onClick={() => window.location.href = `/quiz/${language}`}
          >
            Take a Quiz Instead
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-review">
      <div className="review-header">
        <h2>{language.charAt(0).toUpperCase() + language.slice(1)} Flashcards</h2>
        <div className="review-stats">
          <span className="stat">
            <strong>{stats.reviewed}</strong> reviewed
          </span>
          <span className="stat">
            <strong>{stats.remaining}</strong> remaining
          </span>
          <span className="stat">
            <strong>{currentIndex + 1}</strong> of {flashcards.length}
          </span>
        </div>
      </div>
      
      <div className="flashcard-container">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''} ${isAnimating ? 'animating' : ''}`}
          onClick={handleFlip}
        >
          <div className="flashcard-front">
            <div className="card-content">
              <h3>Front</h3>
              <p className="card-text">{currentCard?.front || 'Loading...'}</p>
              <div className="hint">Click to flip</div>
            </div>
          </div>
          <div className="flashcard-back">
            <div className="card-content">
              <h3>Back</h3>
              <p className="card-text">{currentCard?.back || 'Loading...'}</p>
              <div className="card-details">
                <div className="detail">
                  <span className="label">Examples:</span>
                  <span className="value">{currentCard?.examples?.join(', ') || 'No examples'}</span>
                </div>
                <div className="detail">
                  <span className="label">Mastery:</span>
                  <span className="value">
                    {currentCard?.level ? srs.levels[currentCard.level]?.name : 'New'}
                  </span>
                </div>
              </div>
              <div className="hint">Click to flip back</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rating-buttons">
        <p className="rating-prompt">How well did you know this?</p>
        <div className="buttons-grid">
          <Button 
            variant="danger"
            onClick={() => handleRating('again')}
            className="rating-btn"
          >
            Again<br /><small>1 day</small>
          </Button>
          <Button 
            variant="warning"
            onClick={() => handleRating('hard')}
            className="rating-btn"
          >
            Hard<br /><small>3 days</small>
          </Button>
          <Button 
            variant="info"
            onClick={() => handleRating('good')}
            className="rating-btn"
          >
            Good<br /><small>7 days</small>
          </Button>
          <Button 
            variant="success"
            onClick={() => handleRating('easy')}
            className="rating-btn"
          >
            Easy<br /><small>14 days</small>
          </Button>
        </div>
      </div>
      
      <div className="review-progress">
        <div 
          className="progress-bar"
          style={{ width: `${((currentIndex) / flashcards.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FlashcardReview;
