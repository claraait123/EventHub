import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
const LanguageContext = createContext();

// 2. Create the Provider Component
export const LanguageProvider = ({ children }) => {
  // Initialize state from localStorage or default to English ('en')
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('app-language');
    return savedLanguage ? savedLanguage : 'en';
  });

  // Update localStorage and HTML lang attribute whenever language changes
  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Function to switch between 'en' and 'fr'
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'fr' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. Custom hook for easy access in any component
export const useLanguage = () => {
  return useContext(LanguageContext);
};