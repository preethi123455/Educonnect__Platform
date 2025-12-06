import React, { useState, useContext } from 'react';
import { AppContext } from "./AppContext";
import styles from "./styles";

const Leaderboard = () => {
  const { groqApiKey } = useContext(AppContext);
  const [period, setPeriod] = useState('weekly'); // weekly, monthly, allTime
  const [category, setCategory] = useState('all'); // all, quizzes, courses
  
  const leaderboardData = [
    { rank: 1, name: "Alex Chen", points: 1250, avatar: "A", badges: ["Quiz Master", "Perfect Score"] },
    { rank: 2, name: "Taylor Kim", points: 980, avatar: "T", badges: ["Fast Learner"] },
    { rank: 3, name: "Jordan Smith", points: 840, avatar: "J", badges: ["Course Completer"] },
    { rank: 4, name: "Morgan Lee", points: 780, avatar: "M", badges: ["Quiz Master"] },
    { rank: 5, name: "Casey Johnson", points: 720, avatar: "C", badges: [] },
    { rank: 6, name: "Riley Wilson", points: 690, avatar: "R", badges: ["Perfect Score"] },
    { rank: 7, name: "Jamie Garcia", points: 650, avatar: "J", badges: [] },
    { rank: 8, name: "Student", points: 240, avatar: "S", badges: [], isCurrentUser: true }
  ];
  
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'courses', label: 'Courses' },
    { id: 'content', label: 'Content Created' }
  ];
  
  const periods = [
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: 'allTime', label: 'All Time' }
  ];
  
  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'Quiz Master':
        return '#6a0dad';
      case 'Perfect Score':
        return '#ff9800';
      case 'Fast Learner':
        return '#4caf50';
      case 'Course Completer':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };
  
  return (
    <div>
      <h2 style={{ color: '#6a0dad', marginBottom: '20px' }}>Leaderboard</h2>
      
      <div style={styles.card}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: '8px 15px',
                  borderRadius: '20px',
                  border: 'none',
                  background: category === cat.id ? '#6a0dad' : '#f0e6ff',
                  color: category === cat.id ? 'white' : '#6a0dad',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {periods.map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                style={{
                  padding: '8px 15px',
                  borderRadius: '20px',
                  border: 'none',
                  background: period === p.id ? '#6a0dad' : '#f0e6ff',
                  color: period === p.id ? 'white' : '#6a0dad',
                  cursor: 'pointer'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid #f0f0f0'
            }}>
              <th style={{ 
                padding: '15px 10px', 
                textAlign: 'left',
                width: '80px'
              }}>Rank</th>
              <th style={{ 
                padding: '15px 10px', 
                textAlign: 'left' 
              }}>Learner</th>
              <th style={{ 
                padding: '15px 10px', 
                textAlign: 'left' 
              }}>Badges</th>
              <th style={{ 
                padding: '15px 10px', 
                textAlign: 'right',
                width: '100px'
              }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user) => (
              <tr 
                key={user.rank}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  background: user.isCurrentUser ? '#f9f5ff' : 'transparent',
                }}
              >
                <td style={{ 
                  padding: '15px 10px',
                  textAlign: 'center'
                }}>
                  {user.rank <= 3 ? (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 
                        user.rank === 1 ? '#FFD700' : 
                        user.rank === 2 ? '#C0C0C0' : 
                        '#CD7F32',
                      color: user.rank === 1 ? '#5F4B0E' : '#333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {user.rank}
                    </div>
                  ) : (
                    <div style={{
                      fontWeight: user.isCurrentUser ? 'bold' : 'normal'
                    }}>
                      {user.rank}
                    </div>
                  )}
                </td>
                <td style={{ 
                  padding: '15px 10px',
                  fontWeight: user.isCurrentUser ? 'bold' : 'normal'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: user.isCurrentUser ? '#6a0dad' : '#f0e6ff',
                      color: user.isCurrentUser ? 'white' : '#6a0dad',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {user.avatar}
                    </div>
                    <div>
                      {user.name} 
                      {user.isCurrentUser && (
                        <span style={{
                          marginLeft: '5px',
                          fontSize: '0.8rem',
                          fontStyle: 'italic'
                        }}>
                          (You)
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px 10px' }}>
                  <div style={{
                    display: 'flex',
                    gap: '5px',
                    flexWrap: 'wrap'
                  }}>
                    {user.badges.map((badge, index) => (
                      <span 
                        key={index}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          background: getBadgeColor(badge),
                          color: 'white',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                    {user.badges.length === 0 && (
                      <span style={{ 
                        color: '#999',
                        fontSize: '0.85rem',
                        fontStyle: 'italic'
                      }}>
                        No badges yet
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ 
                  padding: '15px 10px',
                  textAlign: 'right',
                  fontWeight: user.isCurrentUser ? 'bold' : 'normal',
                  color: user.isCurrentUser ? '#6a0dad' : 'inherit'
                }}>
                  {user.points.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '8px',
          background: '#f0e6ff',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ 
              margin: 0, 
              color: '#6a0dad',
              fontSize: '1.1rem'
            }}>
              How to Earn More Points
            </h3>
            <button style={{
              background: 'transparent',
              border: '1px solid #6a0dad',
              color: '#6a0dad',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}>
              View All Achievements
            </button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '10px'
          }}>
            <div style={{
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h4 style={{ marginBottom: '10px' }}>Complete a Quiz</h4>
              <div style={{
                padding: '8px 15px',
                background: '#6a0dad',
                color: 'white',
                borderRadius: '20px'
              }}>
                +150 Points
              </div>
            </div>
            <div style={{
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h4 style={{ marginBottom: '10px' }}>Complete a Course</h4>
              <div style={{
                padding: '8px 15px',
                background: '#4caf50',
                color: 'white',
                borderRadius: '20px'
              }}>
                +200 Points
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;