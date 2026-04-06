import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; 
import { useLanguage } from '../LanguageContext';
import LanguageToggle from './LanguageToggle';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { language } = useLanguage();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/register/', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || (language === 'en' ? 'Registration failed.' : 'L\'inscription a échoué.'));
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Header */}
      <div className="auth-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logoeventhub.png" alt="EventHub Logo" className="auth-logo" />
          <h1 className="auth-brand-title">EventHub</h1>
        </div>
        <LanguageToggle />
      </div>

      {/* Registration Form */}
      <div className="register-container">
        <h2 className="register-title">
          {language === 'en' ? 'Sign Up' : 'S\'inscrire'}
        </h2>
        
        {error && <p className="register-error">{error}</p>}
        
        <form onSubmit={handleRegister} className="register-form">
          <input 
            type="text" 
            placeholder={language === 'en' ? 'Username' : 'Nom d\'utilisateur'} 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="register-input"
          />
          <input 
            type="password" 
            placeholder={language === 'en' ? 'Password' : 'Mot de passe'} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="register-button"
          >
            {isLoading 
              ? (language === 'en' ? 'Loading...' : 'Chargement...') 
              : (language === 'en' ? 'Sign Up' : 'S\'inscrire')}
          </button>
        </form>

        <p className="register-footer-text">
          {language === 'en' ? 'Already have an account? ' : 'Déjà un compte ? '}
          <Link to="/login" className="register-link">
            {language === 'en' ? 'Sign In' : 'Se connecter'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;