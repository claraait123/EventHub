import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Register.css'; 

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/register/', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Sign Up</h2>
      
      {error && <p className="register-error">{error}</p>}
      
      <form onSubmit={handleRegister} className="register-form">
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="register-input"
        />
        <input 
          type="password" 
          placeholder="Password" 
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
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>

      <p className="register-footer-text">
        Déjà un compte ? <Link to="/login" className="register-link">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;