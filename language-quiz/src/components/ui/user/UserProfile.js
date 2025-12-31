import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Button from '../ui/Button';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const [userStats, setUserStats] = useState({
    totalQuizzes: 0,
    totalCorrect: 0,
    streak: 0,
    languages: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) return;
      
      try {
        // In a real app, you'd fetch from Firestore
        // For now, we'll use localStorage and mock data
        const savedProgress = JSON.parse(localStorage.getItem('quizProgress')) || {};
        const savedStreak = localStorage.getItem('quizStreak') || 0;
        const savedTotal = localStorage.getItem('totalQuizzes') || 0;
        
        let totalCorrect = 0;
        Object.values(savedProgress).forEach(lang => {
          totalCorrect += lang.correct || 0;
        });

        setUserStats({
          totalQuizzes: Number(savedTotal),
          totalCorrect,
          streak: Number(savedStreak),
          languages: savedProgress
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {currentUser.email.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{currentUser.email}</h2>
          <p className="member-since">
            Member since {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleLogout}
          className="logout-button"
        >
          Log Out
        </Button>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{userStats.totalQuizzes}</div>
          <div className="stat-label">Quizzes Taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{userStats.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {userStats.totalQuizzes > 0 
              ? Math.round((userStats.totalCorrect / userStats.totalQuizzes) * 100) 
              : 0}%
          </div>
          <div className="stat-label">Accuracy</div>
        </div>
      </div>

      <div className="language-progress-section">
        <h3>Language Progress</h3>
        <div className="languages-grid">
          {Object.entries(userStats.languages).map(([lang, data]) => {
            const percentage = data.total > 0 
              ? Math.round((data.correct / data.total) * 100) 
              : 0;
            
            return (
              <div key={lang} className="language-card">
                <div className="language-header">
                  <h4>{lang.charAt(0).toUpperCase() + lang.slice(1)}</h4>
                  <span className="score">{data.correct}/{data.total}</span>
                </div>
                <div className="progress-container">
                  <div 
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="language-stats">
                  <span>{percentage}% Mastery</span>
                  <span>{data.total} questions</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;