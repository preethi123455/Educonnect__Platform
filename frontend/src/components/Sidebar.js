import React, { useContext, useState } from 'react';
import { AppContext } from "./AppContext";
import styles from "./styles";

const Sidebar = () => {
  const { switchTab, user } = useContext(AppContext);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = {
    Students: [
      { id: 'assistant', label: 'AI Assistant', icon: '💬' },
      { id: 'book', label: 'Book Reader', icon: '📚' },
      { id: 'challenges', label: 'Challenges', icon: '🔥' },
      { id: 'compiler', label: 'Compiler', icon: '🖥' },
      { id: 'content', label: 'Content Explorer', icon: '🔍' },
      { id: 'convo', label: 'Convo Bot', icon: '🤖' },
      { id: 'counselling', label: 'Career Counseling', icon: '🧑‍⚕' },
      { id: 'doubt', label: 'Doubt Solver', icon: '❓' },
      { id: 'latest', label: 'Latest News', icon: '🗓' },
      { id: 'vac', label: 'Job Vacancy', icon: '💼' },
      { id: 'generator', label: 'Portfolio Generator', icon: '🌐' },
      { id: 'quiz', label: 'Quiz Generator', icon: '🧠' },
      { id: 'resume', label: 'Resume Analyzer', icon: '📝' },
      { id: 'study', label: 'Study Schedule', icon: '📅' },
      { id: 'mock', label: 'Mock Interview', icon: '🎤' },
      { id: 'roadmap', label: 'Roadmap', icon: '🗺' },
      { id: 'groups', label: 'Study Group', icon: '📚' },
      { id: 'studie', label: 'Todo List', icon: '📚' },

    ],
    Employees: [
      { id: 'assistant', label: 'AI Assistant', icon: '💬' },
      { id: 'book', label: 'Book Reader', icon: '📚' },
      { id: 'compiler', label: 'Compiler', icon: '🖥' },
      { id: 'content', label: 'Content Explorer', icon: '🔍' },
      { id: 'convo', label: 'Convo Bot', icon: '🤖' },
      { id: 'doubt', label: 'Doubt Solver', icon: '❓' },
      { id: 'vac', label: 'Job Vacancy', icon: '💼' },
      { id: 'mock', label: 'Mock Interview', icon: '🎤' },
      { id: 'generator', label: 'Portfolio Generator', icon: '🌐' },
      { id: 'resume', label: 'Resume Analyzer', icon: '📝' },
      { id: 'groups', label: 'Study Group', icon: '📚' },
      
    ],
    Professors: [
      { id: 'assistant', label: 'AI Assistant', icon: '💬' },
      { id: 'book', label: 'Book Reader', icon: '📚' },
      { id: 'compiler', label: 'Compiler', icon: '🖥' },
      { id: 'content', label: 'Content Explorer', icon: '🔍' },
      { id: 'doubt', label: 'Doubt Solver', icon: '❓' },
      { id: 'vac', label: 'Job Vacancy', icon: '💼' },
      { id: 'quiz', label: 'Quiz Generator', icon: '🧠' },
      { id: 'convo', label: 'Convo Bot', icon: '🤖' },
      { id: 'groups', label: 'Study Group', icon: '📚' },
    ],
    Interviewers: [
      { id: 'assistant', label: 'AI Assistant', icon: '💬' },
      { id: 'quiz', label: 'Quiz Generator', icon: '🧠' },
      { id: 'compiler', label: 'Compiler', icon: '🖥' },
      { id: 'content', label: 'Content Explorer', icon: '🔍' },
      { id: 'convo', label: 'Convo Bot', icon: '🤖' },
      { id: 'groups', label: 'Study Group', icon: '📚' },
    ],
    All : [
      { id: 'assistant', label: 'AI Assistant', icon: '💬' },
      { id: 'book', label: 'Book Reader', icon: '📚' },
      { id: 'challenges', label: 'Challenges', icon: '🔥' },
      { id: 'compiler', label: 'Compiler', icon: '🖥' },
      { id: 'content', label: 'Content Explorer', icon: '🔍' },
      { id: 'convo', label: 'Convo Bot', icon: '🤖' },
      { id: 'counselling', label: 'Career Counseling', icon: '🧑‍⚕' },
      { id: 'doubt', label: 'Doubt Solver', icon: '❓' },
      { id: 'latest', label: 'Latest News', icon: '🗓' },
      { id: 'vac', label: 'Job Vacancy', icon: '💼' },
      { id: 'generator', label: 'Portfolio Generator', icon: '🌐' },
      { id: 'quiz', label: 'Quiz Generator', icon: '🧠' },
      { id: 'resume', label: 'Resume Analyzer', icon: '📝' },
      { id: 'study', label: 'Study Schedule', icon: '📅' },
      { id: 'groups', label: 'Study Group', icon: '📚' },
      { id: 'roadmap', label: 'Roadmap', icon: '🗺' },
      { id: 'mock', label: 'Mock Interview', icon: '🎤' }
    ]
  };

  return (
    <div style={{ ...styles.sidebar, height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Sticky Navbar for Login and Signup */}
      <div style={{ ...styles.navbar, position: 'sticky', top: 0, background: '#fff', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <button style={styles.button} onClick={() => switchTab('login')}>🔐 Login</button>
        <button style={styles.button} onClick={() => switchTab('signup')}>✍ Sign Up</button>
      </div>
      <div style={{ ...styles.navbar, position: 'sticky', top: 0, background: '#fff', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
      <button style={styles.button}>⚡ Go Pro</button>

      </div>

      {/* Section Buttons with Improved Styling */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {Object.keys(categories).map(category => (
          <button 
            key={category} 
            style={{ 
              width: '200px', 
              padding: '12px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              textAlign: 'center',
              backgroundColor: activeCategory === category ? '#6a0dad' : '#4a0c8a',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: '0.3s',
              boxShadow: activeCategory === category ? '0px 4px 6px rgba(0,0,0,0.2)' : 'none'
            }}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Dynamic Content with Better Alignment */}
      <nav style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '20px', paddingLeft: '20px' }}>
        {activeCategory && categories[activeCategory].map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: '0.2s',
              borderRadius: '5px',
              backgroundColor: '#f4f4f4',
              margin: '5px 0',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
            }}
            onClick={() => switchTab(item.id)}
          >
            <span style={{ fontSize: '20px', marginRight: '10px' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;