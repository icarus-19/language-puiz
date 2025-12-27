import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/ui/Header';
import QuizSession from './components/quiz/QuizSession';
import QuizTypeSelector from './components/quiz/QuizTypeSelector';
import ProgressTracker from './components/user/ProgressTracker';
import VocabularyQuiz from './components/quiz/VocabularyQuiz';
import GrammarQuiz from './components/quiz/GrammarQuiz';
import TranslationQuiz from './components/quiz/TranslationQuiz';
import ListeningQuiz from './components/quiz/ListeningQuiz';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<QuizTypeSelector />} />
            <Route path="/quiz/:language" element={<QuizTypeSelector />} />
            <Route path="/quiz/:language/vocabulary" element={<VocabularyQuiz />} />
            <Route path="/quiz/:language/grammar" element={<GrammarQuiz />} />
            <Route path="/quiz/:language/translation" element={<TranslationQuiz />} />
            <Route path="/quiz/:language/listening" element={<ListeningQuiz />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <>
      <div className="home-container">
        <h1>Welcome to Language Quiz</h1>
        <p>Test your language skills with interactive quizzes!</p>
        <div className="language-buttons">
          <a href="/quiz/spanish" className="start-button">
            Start Spanish Quiz
          </a>
          <a href="/quiz/french" className="start-button secondary">
            Start French Quiz
          </a>
          <a href="/quiz/german" className="start-button secondary">
            Start German Quiz
          </a>
        </div>
      </div>
      <ProgressTracker />
    </>
  );
}

export default App;