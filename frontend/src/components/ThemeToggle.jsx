import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <button 
      className="theme-toggle-btn" 
      onClick={() => setIsDarkMode(!isDarkMode)}
      title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
    >
      <img 
        src={isDarkMode ? "/sun.ico" : "/moon.ico"} 
        alt={isDarkMode ? "Mode clair" : "Mode sombre"} 
        className="theme-icon"
      />
    </button>
  );
};

export default ThemeToggle;