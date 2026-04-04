import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  // 1. Initialize state by reading localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('app-theme');
    // If "dark" was saved, return true; otherwise false
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Optional: Check the user's system color scheme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });

  // 2. When 'isDarkMode' changes, update the DOM and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('app-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('app-theme', 'light');
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