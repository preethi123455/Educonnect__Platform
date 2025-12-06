import React, { useContext } from 'react';
import { AppContext } from "./AppContext";
import styles from "./styles";

const Header = () => {
  const { user, toggleVoice, voiceEnabled, changeLanguage, language } = useContext(AppContext);
  
  const languages = ["English", "Spanish", "French", "German", "Chinese"];
  
  return (
    <header style={styles.header}>
      <h1 style={styles.headerTitle}>EduConnect</h1>
      
      <div style={styles.controls}>
        <select 
          value={language} 
          onChange={(e) => changeLanguage(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: 'black'
          }}
        >
          {languages.map(lang => (
            <option key={lang.toLowerCase()} value={lang.toLowerCase()}>
              {lang}
            </option>
          ))}
        </select>
        
        <button 
          onClick={toggleVoice} 
          style={{
            ...styles.button,
            background: voiceEnabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)'
          }}
        >
          {voiceEnabled ? 'Voice: ON' : 'Voice: OFF'}
        </button>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>{user.name}</span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#f0e6ff',
            color: '#6a0dad',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;