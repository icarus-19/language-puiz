export class SpacedRepetitionSystem {
  constructor() {
    this.levels = [
      { interval: 1, name: 'Again' },      // 1 day
      { interval: 3, name: 'Hard' },       // 3 days
      { interval: 7, name: 'Good' },       // 7 days
      { interval: 14, name: 'Easy' },      // 14 days
      { interval: 30, name: 'Master' }     // 30 days
    ];
  }

  // Calculate next review date based on performance
  calculateNextReview(currentLevel, performance) {
    const today = new Date();
    let nextInterval;
    
    if (performance === 'again') {
      nextInterval = this.levels[0].interval;
    } else if (performance === 'hard') {
      nextInterval = this.levels[1].interval;
    } else if (performance === 'good') {
      nextInterval = this.levels[2].interval;
    } else if (performance === 'easy') {
      nextInterval = this.levels[3].interval;
    } else {
      nextInterval = this.levels[currentLevel]?.interval || 1;
    }
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + nextInterval);
    
    return {
      nextReviewDate: nextDate.toISOString(),
      nextInterval: nextInterval,
      level: this.getLevelFromInterval(nextInterval)
    };
  }

  getLevelFromInterval(interval) {
    return this.levels.findIndex(l => l.interval === interval) || 0;
  }

  // Get flashcards due for review
  getDueFlashcards(flashcards) {
    const today = new Date();
    return flashcards.filter(card => {
      if (!card.nextReviewDate) return true;
      const reviewDate = new Date(card.nextReviewDate);
      return reviewDate <= today;
    });
  }

  // Calculate mastery percentage
  calculateMastery(flashcards) {
    if (flashcards.length === 0) return 0;
    
    const masteredCards = flashcards.filter(card => {
      const level = this.getLevelFromInterval(card.interval || 1);
      return level >= 3; // "Easy" or "Master" level
    }).length;
    
    return Math.round((masteredCards / flashcards.length) * 100);
  }
}

// Flashcard database helper
export class FlashcardManager {
  constructor(userId) {
    this.userId = userId;
    this.storageKey = `flashcards_${userId}`;
  }

  saveFlashcard(flashcard) {
    const flashcards = this.getAllFlashcards();
    const existingIndex = flashcards.findIndex(f => f.id === flashcard.id);
    
    if (existingIndex >= 0) {
      flashcards[existingIndex] = flashcard;
    } else {
      flashcards.push(flashcard);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(flashcards));
    return flashcard;
  }

  getAllFlashcards() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  getFlashcardsByLanguage(language) {
    const flashcards = this.getAllFlashcards();
    return flashcards.filter(f => f.language === language);
  }

  deleteFlashcard(flashcardId) {
    const flashcards = this.getAllFlashcards();
    const filtered = flashcards.filter(f => f.id !== flashcardId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return filtered;
  }

  resetProgress(language) {
    const flashcards = this.getAllFlashcards();
    const updated = flashcards.map(f => {
      if (f.language === language) {
        return { ...f, interval: 1, nextReviewDate: null, reviewCount: 0 };
      }
      return f;
    });
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return updated;
  }
}