import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🌍</span>
          <h1>Language Quiz</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/quiz/spanish" className="nav-link">Start Quiz</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
