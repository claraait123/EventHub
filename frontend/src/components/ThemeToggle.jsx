import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  // 1. On initialise l'état en lisant le localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('app-theme');
    // Si on a sauvegardé "dark", on retourne true, sinon false
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Optionnel: Vérifier les préférences système de l'utilisateur
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });

  // 2. À chaque changement de 'isDarkMode', on met à jour le DOM ET le localStorage
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