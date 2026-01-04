// Add this import
import { SpacedRepetitionSystem } from '../../services/spacedRepetition';

// Add this inside the component after loading userStats
const [flashcardStats, setFlashcardStats] = useState({});

useEffect(() => {
  const loadFlashcardStats = () => {
    const srs = new SpacedRepetitionSystem();
    const flashcardManager = new FlashcardManager(currentUser?.uid || 'guest');
    
    const languages = ['spanish', 'french', 'german'];
    const stats = {};
    
    languages.forEach(lang => {
      const cards = flashcardManager.getFlashcardsByLanguage(lang);
      stats[lang] = {
        total: cards.length,
        due: srs.getDueFlashcards(cards).length,
        mastery: srs.calculateMastery(cards)
      };
    });
    
    setFlashcardStats(stats);
  };
  
  loadFlashcardStats();
}, [currentUser]);

// Add flashcard stats display
{Object.entries(flashcardStats).map(([lang, stats]) => (
  stats.total > 0 && (
    <div key={lang} className="flashcard-stat">
      <h4>{lang.charAt(0).toUpperCase() + lang.slice(1)} Flashcards</h4>
      <div className="flashcard-details">
        <span>Total: {stats.total}</span>
        <span>Due: {stats.due}</span>
        <span>Mastery: {stats.mastery}%</span>
      </div>
    </div>
  )
))}
import { useState, useEffect } from 'react';
import FlashcardManager from '../../services/flashcardManager';