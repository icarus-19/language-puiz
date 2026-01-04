import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('weekly'); // daily, weekly, monthly
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      // Mock data for now - in real app, fetch from Firestore
      const mockLeaderboard = [
        { id: 1, username: 'LanguageMaster', score: 1250, streak: 42, avatar: '👑' },
        { id: 2, username: 'PolyglotPro', score: 1100, streak: 35, avatar: '🌟' },
        { id: 3, username: 'WordWizard', score: 980, streak: 28, avatar: '⚡' },
        { id: 4, username: 'GrammarGuru', score: 850, streak: 21, avatar: '📚' },
        { id: 5, username: currentUser?.email?.split('@')[0] || 'You', score: 720, streak: 15, avatar: '😊' },
        { id: 6, username: 'LinguaLearner', score: 650, streak: 12, avatar: '🌍' },
        { id: 7, username: 'VocabViking', score: 580, streak: 10, avatar: '🛡️' },
        { id: 8, username: 'SyntaxSavior', score: 520, streak: 8, avatar: '💡' }
      ];

      // Sort by score
      const sorted = mockLeaderboard.sort((a, b) => b.score - a.score);
      setLeaderboard(sorted);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      default: return 'All Time';
    }
  };

  const getMedal = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return position;
    }
  };

  if (loading) {
    return (
      <div className="leaderboard loading">
        <div className="spinner"></div>
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Global Leaderboard</h2>
        <div className="timeframe-selector">
          <Button 
            variant={timeframe === 'daily' ? 'primary' : 'secondary'}
            onClick={() => setTimeframe('daily')}
            size="small"
          >
            Daily
          </Button>
          <Button 
            variant={timeframe === 'weekly' ? 'primary' : 'secondary'}
            onClick={() => setTimeframe('weekly')}
            size="small"
          >
            Weekly
          </Button>
          <Button 
            variant={timeframe === 'monthly' ? 'primary' : 'secondary'}
            onClick={() => setTimeframe('monthly')}
            size="small"
          >
            Monthly
          </Button>
        </div>
      </div>

      <div className="timeframe-info">
        <span className="badge">{getTimeframeLabel()}</span>
        <span className="info">Updated just now</span>
      </div>

      <div className="leaderboard-content">
        <div className="table-header">
          <div className="header-cell rank">Rank</div>
          <div className="header-cell user">User</div>
          <div className="header-cell score">Score</div>
          <div className="header-cell streak">Streak</div>
        </div>

        <div className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <div 
              key={user.id} 
              className={`leaderboard-row ${user.username.toLowerCase() === currentUser?.email?.split('@')[0]?.toLowerCase() ? 'current-user' : ''}`}
            >
              <div className="cell rank">
                <span className="rank-number">{getMedal(index + 1)}</span>
              </div>
              <div className="cell user">
                <span className="user-avatar">{user.avatar}</span>
                <div className="user-info">
                  <span className="username">{user.username}</span>
                  {user.username.toLowerCase() === currentUser?.email?.split('@')[0]?.toLowerCase() && (
                    <span className="you-badge">You</span>
                  )}
                </div>
              </div>
              <div className="cell score">
                <span className="score-value">{user.score.toLocaleString()}</span>
                <span className="score-label">points</span>
              </div>
              <div className="cell streak">
                <div className="streak-container">
                  <span className="streak-value">{user.streak}</span>
                  <span className="streak-label">days</span>
                  <div className="streak-fire">🔥</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="leaderboard-footer">
        <div className="user-stats">
          <div className="stat">
            <span className="stat-label">Your Rank</span>
            <span className="stat-value">
              #{leaderboard.findIndex(u => 
                u.username.toLowerCase() === currentUser?.email?.split('@')[0]?.toLowerCase()
              ) + 1 || '--'}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Your Score</span>
            <span className="stat-value">
              {leaderboard.find(u => 
                u.username.toLowerCase() === currentUser?.email?.split('@')[0]?.toLowerCase()
              )?.score?.toLocaleString() || '0'}
            </span>
          </div>
        </div>
        <Button 
          variant="primary"
          onClick={() => window.location.href = '/quiz'}
          className="play-button"
        >
          Play Now to Earn Points!
        </Button>
      </div>
    </div>
  );
};

export default Leaderboard;
