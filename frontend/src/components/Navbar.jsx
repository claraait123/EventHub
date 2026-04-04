import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprime le token
    navigate('/login'); // Redirige vers le login
  };

  return (
    <nav className="navbar-container">
      <Link to="/events" className="navbar-link">
        📅 Événements
      </Link>
      <Link to="/participants" className="navbar-link">
        👥 Participants
      </Link>
      <button onClick={handleLogout} className="navbar-logout-btn">
        Se déconnecter
      </button>
    </nav>
  );
}

export default Navbar;