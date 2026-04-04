import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/login/', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/events');
    } catch (err) {
      setError('Incorrect username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Sign In</h2>
      
      {error && <p className="login-error">{error}</p>}
      
      <form onSubmit={handleLogin} className="login-form">
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="login-button"
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <p className="login-footer-text">
        Don't have an account yet? <Link to="/register" className="login-link">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;