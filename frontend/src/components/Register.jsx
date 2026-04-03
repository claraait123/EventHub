import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

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
    <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '50px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Créer un compte (Sign Up)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Nom d'utilisateur" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '10px', backgroundColor: isLoading ? '#6c757d' : '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Déjà un compte ? <Link to="/login">Se connecter (Sign In)</Link>
      </p>
    </div>
  );
}

export default Register;
