import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprime le token
    navigate('/login'); // Redirige vers le login
  };

  return (
    <nav style={{ padding: '15px', backgroundColor: '#f0f0f0', marginBottom: '20px', display: 'flex', gap: '20px' }}>
      <Link to="/events" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>📅 Événements</Link>
      <Link to="/participants" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>👥 Participants</Link>
      <button onClick={handleLogout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>Se déconnecter</button>
    </nav>
  );
}

export default Navbar;
