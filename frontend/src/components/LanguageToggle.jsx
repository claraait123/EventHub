import React from 'react';
import { useLanguage } from '../LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      className="lang-toggle-btn" 
      onClick={toggleLanguage}
      title={language === 'en' ? "Passer en français" : "Switch to English"}
    >
      {language === 'en' ? 'FR' : 'EN'}
    </button>
  );
};

export default LanguageToggle;