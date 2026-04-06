import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useLanguage } from '../LanguageContext';

function ParticipantDashboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await api.get('/me/');
        setCurrentUser(meRes.data);

        // Administrator check
        if (meRes.data.is_staff) {
          const usersRes = await api.get('/admin/users/');
          setUsers(usersRes.data);
          setError(null); // Clear errors on success
        } else {
          setError(
            language === 'en' 
              ? 'Access Denied. This page is restricted to administrators.' 
              : 'Accès refusé. Cette page est réservée aux administrateurs.'
          );
        }
      } catch (err) {
        setError(
          language === 'en' 
            ? 'Failed to load data. Make sure you are logged in.' 
            : 'Échec du chargement des données. Assurez-vous d\'être connecté.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [language]); // React to language changes so error messages translate dynamically

  const handleDelete = async (username) => {
    const confirmMessage = language === 'en'
      ? `Are you sure you want to delete ${username}'s account? All their events will be lost.`
      : `Êtes-vous sûr de vouloir supprimer le compte de ${username} ? Tous ses événements seront perdus.`;
      
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;
    
    try {
      await api.delete(`/profiles/${username}/delete/`);
      setUsers(users.filter(u => u.username !== username));
    } catch (err) {
      alert(err.response?.data?.error || (language === 'en' ? 'Could not delete user.' : 'Impossible de supprimer l\'utilisateur.'));
    }
  };

  const handleEdit = async (username) => {
    const promptMessage = language === 'en'
      ? `Enter a new username for ${username}:`
      : `Entrez un nouveau nom d'utilisateur pour ${username} :`;
      
    const newUsername = window.prompt(promptMessage, username);
    if (!newUsername || newUsername === username) return;

    try {
      await api.patch(`/admin/users/${username}/edit/`, { username: newUsername });
      // Update the displayed list locally
      setUsers(users.map(u => u.username === username ? { ...u, username: newUsername } : u));
    } catch (err) {
      alert(err.response?.data?.error || (language === 'en' ? 'Could not update username.' : 'Impossible de mettre à jour le nom d\'utilisateur.'));
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <p style={{textAlign: 'center', marginTop: '40px'}}>
          {language === 'en' ? 'Loading...' : 'Chargement...'}
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="dashboard-container">
          <h2 style={{color: '#dc3545'}}>🛑 {error}</h2>
          <button onClick={() => navigate('/events')} className="btn-action btn-edit" style={{maxWidth: '200px'}}>
            ← {language === 'en' ? 'Back to Events' : 'Retour aux événements'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2>
          👥 {language === 'en' ? 'Registered Accounts' : 'Comptes Inscrits'} ({users.length})
        </h2>
        
        <div className="users-grid">
          {users.map(user => (
            <div className="user-card" key={user.id}>
              
              {/* Header: Avatar + Username + Date */}
              <div className="user-card-header">
                <img src={user.avatar_url} alt={user.username} className="user-avatar" />
                <div className="user-info">
                  <h3 
                    className="user-name" 
                    onClick={() => navigate(`/${user.username}`)}
                    title={language === 'en' ? 'View Profile' : 'Voir le profil'}
                  >
                    {user.username}
                    {user.is_staff && <span className="admin-badge">Admin</span>}
                  </h3>
                  <p className="user-date">
                    {language === 'en' ? 'Joined:' : 'Inscrit le :'} {user.date_joined}
                  </p>
                </div>
              </div>
              
              {/* Actions: Edit + Delete */}
              <div className="user-actions">
                <button 
                  className="btn-action btn-edit" 
                  onClick={() => handleEdit(user.username)}
                >
                  ✏️ {language === 'en' ? 'Edit' : 'Modifier'}
                </button>
                <button 
                  className="btn-action btn-delete" 
                  onClick={() => handleDelete(user.username)}
                  disabled={user.username === currentUser.username}
                  title={
                    user.username === currentUser.username 
                      ? (language === 'en' ? "You cannot delete your own account here." : "Vous ne pouvez pas supprimer votre propre compte ici.") 
                      : (language === 'en' ? "Delete user" : "Supprimer l'utilisateur")
                  }
                >
                  🗑️ {language === 'en' ? 'Delete' : 'Supprimer'}
                </button>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ParticipantDashboard;