import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/ui/Header';
import QuizSession from './components/quiz/QuizSession';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<QuizSession />} />
            <Route path="/quiz/:language" element={<QuizSession />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
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
  );
}

export default App;
