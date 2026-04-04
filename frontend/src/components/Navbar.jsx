import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Charger les infos de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Pas connecté

        // On récupère les infos globales (pour is_staff) et le profil (pour l'avatar)
        const [meRes, settingsRes] = await Promise.all([
          api.get('/me/'),
          api.get('/settings/')
        ]);
        
        setUser(meRes.data);
        setProfileData(settingsRes.data);
      } catch (err) {
        console.error("Failed to load user in Navbar", err);
      }
    };
    fetchUser();
  }, []);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Si pas connecté, on affiche une navbar minimaliste (utile pour /login ou /register)
  if (!user || !profileData) {
    return (
      <nav className="navbar-container">
        <div className="navbar-left">
          <Link to="/events" className="navbar-brand">
            <img src="../../public/logo.ico" alt="EventHub Logo" onError={(e) => e.target.style.display='none'} />
            <span>EventHub</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar-container">
      {/* GAUCHE : Logo + Manage Users (si admin) */}
      <div className="navbar-left">
        <Link to="/events" className="navbar-brand">
          <img src="../../public/logo.ico" alt="EventHub Logo" onError={(e) => e.target.style.display='none'} />
          <span>EventHub</span>
        </Link>
        
        {user.is_staff && (
          <Link to="/participants" className="navbar-link">
            👥 Manage Users
          </Link>
        )}
      </div>

      {/* DROITE : Pseudo + Avatar / Dropdown */}
      <div className="navbar-right">
        <Link to={`/${user.username}`} className="navbar-user">
          {user.username}
        </Link>

        <div className="dropdown-container" ref={dropdownRef}>
          <div 
            className={`dropdown-trigger ${dropdownOpen ? 'open' : ''}`} 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img 
              src={profileData.avatar_url} 
              alt="Avatar" 
              className="dropdown-avatar" 
            />
            <span className="dropdown-icon">▼</span>
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to={`/${user.username}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                Profile
              </Link>
              <Link to="/my-events" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                My Events
              </Link>
              <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                Settings
              </Link>
              <Link to="/add-event" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                Add Event
              </Link>
              
              <div className="dropdown-divider"></div>
              
              <button onClick={handleLogout} className="dropdown-item dropdown-logout">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;