import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useLanguage } from '../LanguageContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { language } = useLanguage();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/login/', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/events');
    } catch (err) {
      setError(
        language === 'en' 
          ? 'Incorrect username or password.' 
          : 'Nom d\'utilisateur ou mot de passe incorrect.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Header */}
      <div className="auth-header">
        <img src="/logoeventhub.png" alt="EventHub Logo" className="auth-logo" />
        <h1 className="auth-brand-title">EventHub</h1>
      </div>

      {/* Login Form */}
      <div className="login-container">
        <h2 className="login-title">
          {language === 'en' ? 'Sign In' : 'Se connecter'}
        </h2>
        
        {error && <p className="login-error">{error}</p>}
        
        <form onSubmit={handleLogin} className="login-form">
          <input 
            type="text" 
            placeholder={language === 'en' ? 'Username' : 'Nom d\'utilisateur'} 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder={language === 'en' ? 'Password' : 'Mot de passe'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
              style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                userSelect: 'none',
                opacity: 0.7
              }}
              title={showPassword 
                ? (language === 'en' ? 'Hide password' : 'Cacher le mot de passe') 
                : (language === 'en' ? 'Show password' : 'Afficher le mot de passe')
              }
            >
              <img 
                src={showPassword ? '/eyeclosed.ico' : '/eyeopen.ico'} 
                alt={showPassword ? "Cacher" : "Afficher"}
                style={{ width: '20px', height: '20px' }}
              />
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading 
              ? (language === 'en' ? 'Loading...' : 'Chargement...') 
              : (language === 'en' ? 'Sign In' : 'Se connecter')}
          </button>
        </form>

        <p className="login-footer-text">
          {language === 'en' ? "Don't have an account yet? " : "Vous n'avez pas encore de compte ? "}
          <Link to="/register" className="login-link">
            {language === 'en' ? 'Sign up' : 'S\'inscrire'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;