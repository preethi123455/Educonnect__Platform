import React from 'react';
import styles from "./styles";

const Dashboard = () => {
  const stats = [
    { label: 'Quizzes Taken', value: 24, icon: '📝' },
    { label: 'Average Score', value: '87%', icon: '📊' },
    { label: 'Points Earned', value: 580, icon: '🌟' },
    { label: 'Rank', value: '#12', icon: '🏆' }
  ];
  
  const activities = [
    { type: 'Quiz', title: 'Machine Learning Basics', score: '92%', date: '2 days ago' },
    { type: 'Course', title: 'Python for Data Science', progress: '68%', date: '1 week ago' },
    { type: 'Resume', title: 'Resume Analysis', status: 'Completed', date: 'Yesterday' }
  ];
  
  return (
    <div>
      <h2 style={{ color: '#6a0dad', marginBottom: '20px' }}>Your Learning Dashboard</h2>
      
      <div style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
            <div style={styles.statValue}>{stat.value}</div>
            <div>{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Recent Activity</h3>
          <button style={styles.button}>View All</button>
        </div>
        
        <div>
          {activities.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 0',
              borderBottom: index < activities.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: '#f0e6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6a0dad',
                  fontWeight: 'bold'
                }}>
                  {activity.type.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>{activity.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{activity.type}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#6a0dad', fontWeight: '500' }}>
                  {activity.score || activity.progress || activity.status}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{activity.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;