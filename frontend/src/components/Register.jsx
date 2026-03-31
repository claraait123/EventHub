import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Appel à la nouvelle route de création de compte
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username,
        password,
      });
      
      // Stockage du token et connexion automatique
      localStorage.setItem('token', response.data.token);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.");
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
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px' }}>
          S'inscrire
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Déjà un compte ? <Link to="/login">Se connecter (Sign In)</Link>
      </p>
    </div>
  );
}

export default Register;
