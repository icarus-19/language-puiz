import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={`toggle-track ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="toggle-thumb">
          {isDarkMode ? '🌙' : '☀️'}
        </div>
      </div>
      <span className="toggle-label">
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;