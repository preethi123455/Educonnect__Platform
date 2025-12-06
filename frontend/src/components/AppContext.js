import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ 
    name: "Student", 
    points: 240,
    level: 1,
    achievements: []
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState('english');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [theme, setTheme] = useState({ primary: '#6a0dad', secondary: '#ffffff' });
  
  const groqApiKey = "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";
  const addPoints = (points) => {
    setUser(prevUser => {
      const newPoints = prevUser.points + points;
      const newLevel = Math.floor(newPoints / 1000) + 1;
      return {
        ...prevUser,
        points: newPoints,
        level: newLevel
      };
    });
  };
  const addAchievement = (achievement) => {
    setUser(prevUser => ({
      ...prevUser,
      achievements: [...prevUser.achievements, achievement]
    }));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      activeTab,
      switchTab,
      language,
      changeLanguage,
      voiceEnabled,
      toggleVoice,
      theme,
      groqApiKey,
      addPoints,
      addAchievement
    }}>
      {children}
    </AppContext.Provider>
  );
};