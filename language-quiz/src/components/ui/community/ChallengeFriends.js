import React, { useState } from 'react';
import Button from '../ui/Button';
import './ChallengeFriends.css';

const ChallengeFriends = () => {
  const [friends] = useState([
    { id: 1, name: 'Alex Johnson', status: 'online', score: 950 },
    { id: 2, name: 'Maria Garcia', status: 'online', score: 880 },
    { id: 3, name: 'Sam Wilson', status: 'offline', score: 750 },
    { id: 4, name: 'Lisa Chen', status: 'online', score: 920 },
    { id: 5, name: 'David Kim', status: 'offline', score: 680 }
  ]);

  const [challengeSent, setChallengeSent] = useState([]);

  const sendChallenge = (friendId) => {
    if (!challengeSent.includes(friendId)) {
      setChallengeSent([...challengeSent, friendId]);
      
      // Simulate sending challenge
      setTimeout(() => {
        alert(`Challenge sent to ${friends.find(f => f.id === friendId)?.name}!`);
      }, 300);
    }
  };

  const getStatusColor = (status) => {
    return status === 'online' ? '#2ecc71' : '#95a5a6';
  };

  return (
    <div className="challenge-friends">
      <div className="challenge-header">
        <h2>Challenge Friends</h2>
        <p>Compete with friends in language quizzes!</p>
      </div>

      <div className="friends-list">
        {friends.map(friend => (
          <div key={friend.id} className="friend-card">
            <div className="friend-info">
              <div className="friend-avatar">
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(friend.status) }}
                ></div>
                <span className="avatar-icon">
                  {friend.name.charAt(0)}
                </span>
              </div>
              <div className="friend-details">
                <h4>{friend.name}</h4>
                <div className="friend-stats">
                  <span className="stat">
                    <strong>{friend.score}</strong> points
                  </span>
                  <span className="status">
                    <span 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(friend.status) }}
                    ></span>
                    {friend.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="challenge-actions">
              <Button
                variant={challengeSent.includes(friend.id) ? "success" : "primary"}
                onClick={() => sendChallenge(friend.id)}
                disabled={friend.status === 'offline' || challengeSent.includes(friend.id)}
                size="small"
              >
                {challengeSent.includes(friend.id) ? '✓ Sent' : 'Challenge'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="challenge-options">
        <h3>Quick Challenges</h3>
        <div className="quick-challenges">
          <Button
            variant="secondary"
            onClick={() => window.location.href = '/quiz/spanish/vocabulary'}
            className="quick-challenge"
          >
            Spanish Vocabulary Race
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.location.href = '/quiz/french/grammar'}
            className="quick-challenge"
          >
            French Grammar Duel
          </Button>
          <Button
            variant="secondary"
            onClick={() => alert('Share link copied to clipboard!')}
            className="quick-challenge"
          >
            Copy Challenge Link
          </Button>
        </div>
      </div>

      <div className="challenge-rules">
        <h4>How Challenges Work:</h4>
        <ul>
          <li>Both players take the same quiz</li>
          <li>Highest score wins the challenge</li>
          <li>Earn bonus points for winning</li>
          <li>Results appear on leaderboard</li>
        </ul>
      </div>
    </div>
  );
};

export default ChallengeFriends;