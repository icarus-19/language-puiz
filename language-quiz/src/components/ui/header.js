import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import './Header.css';// Update nav section for logged-in users
{currentUser ? (
  <>
    <Link to="/quiz" className="nav-link">Quizzes</Link>
    <Link to="/flashcards/spanish" className="nav-link">Flashcards</Link>
    <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
    <Link to="/challenge" className="nav-link">Challenge</Link>
    <Link to="/profile" className="nav-link">Profile</Link>
    <Button 
      onClick={handleLogout} 
      variant="secondary" 
      size="small"
    >
      Log Out
    </Button>
  </>
) : (
  // ... existing code
  <>
    <Link to="/login" className="nav-link">Log In</Link>
    <Link to="/signup" className="nav-link">
      <Button variant="primary" size="small">
        Sign Up
      </Button>
    </Link>
  </>
)};

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🌍</span>
          <h1>Language Quiz</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          {currentUser ? (
            <>
              <Link to="/quiz" className="nav-link">Quizzes</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <Button 
                onClick={handleLogout} 
                variant="secondary" 
                size="small"
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log In</Link>
              <Link to="/signup" className="nav-link">
                <Button variant="primary" size="small">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;