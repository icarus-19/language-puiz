import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/ui/Header';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import UserProfile from './components/user/UserProfile';
import QuizTypeSelector from './components/quiz/QuizTypeSelector';
import ProgressTracker from './components/user/ProgressTracker';
import VocabularyQuiz from './components/quiz/VocabularyQuiz';
import GrammarQuiz from './components/quiz/GrammarQuiz';
import TranslationQuiz from './components/quiz/TranslationQuiz';
import ListeningQuiz from './components/quiz/ListeningQuiz';
import './App.css';
import FlashcardReview from './components/flashcards/FlashcardReview';
import Leaderboard from './components/community/Leaderboard';
import ChallengeFriends from './components/community/ChallengeFriends';
import app from './firebase/config';
function Home() {
  
  return (
    <>
      <div className="home-container">
        <h1>Master Languages with Smart Quizzes</h1>
        <p>Interactive learning with spaced repetition, challenges, and progress tracking</p>
        <div className="home-features">
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h3>Smart Flashcards</h3>
            <p>Spaced repetition system optimizes your learning</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🏆</div>
            <h3>Compete & Learn</h3>
            <p>Challenge friends and climb the leaderboard</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📈</div>
            <h3>Track Progress</h3>
            <p>Detailed analytics and mastery levels</p>
          </div>
        </div>
        <div className="home-actions">
          <a href="/signup" className="start-button">
            Start Learning Free
          </a>
          <a href="/login" className="start-button secondary">
            Already have account? Log In
          </a>
        </div>
      </div>
      <ProgressTracker />
    </>
  );
}
function App() {
  return (
    <AuthProvider>
      <Route path="/flashcards/:language" element={
  <PrivateRoute>
    <FlashcardReview />
  </PrivateRoute>
} />
<Route path="/leaderboard" element={
  <PrivateRoute>
    <Leaderboard />
  </PrivateRoute>
} />
<Route path="/challenge" element={
  <PrivateRoute>
    <ChallengeFriends />
  </PrivateRoute>
} />
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/quiz" element={
                <PrivateRoute>
                  <QuizTypeSelector />
                </PrivateRoute>
              } />
              <Route path="/quiz/:language" element={
                <PrivateRoute>
                  <QuizTypeSelector />
                </PrivateRoute>
              } />
              <Route path="/quiz/:language/vocabulary" element={
                <PrivateRoute>
                  <VocabularyQuiz />
                </PrivateRoute>
              } />
              <Route path="/quiz/:language/grammar" element={
                <PrivateRoute>
                  <GrammarQuiz />
                </PrivateRoute>
              } />
              <Route path="/quiz/:language/translation" element={
                <PrivateRoute>
                  <TranslationQuiz />
                </PrivateRoute>
              } />
              <Route path="/quiz/:language/listening" element={
                <PrivateRoute>
                  <ListeningQuiz />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
    </AuthProvider>
  );
}

function Home() {
  return (
    <>
      <div className="home-container">
        <h1>Welcome to Language Quiz</h1>
        <p>Master languages through interactive quizzes and track your progress!</p>
        <div className="home-actions">
          <a href="/signup" className="start-button">
            Get Started Free
          </a>
          <a href="/login" className="start-button secondary">
            Log In
          </a>
        </div>
      </div>
      <ProgressTracker />
    </>
  );
}

export default App;