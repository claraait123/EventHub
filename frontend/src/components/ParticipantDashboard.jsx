import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

function ParticipantDashboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await api.get('/me/');
        setCurrentUser(meRes.data);

        // Vérification administrateur
        if (meRes.data.is_staff) {
          const usersRes = await api.get('/admin/users/');
          setUsers(usersRes.data);
        } else {
          setError('Access Denied. This page is restricted to administrators.');
        }
      } catch (err) {
        setError('Failed to load data. Make sure you are logged in.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (username) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${username}'s account? All their events will be lost.`);
    if (!confirmed) return;
    
    try {
      await api.delete(`/profiles/${username}/delete/`);
      setUsers(users.filter(u => u.username !== username));
    } catch (err) {
      alert(err.response?.data?.error || 'Could not delete user.');
    }
  };

  const handleEdit = async (username) => {
    const newUsername = window.prompt(`Enter a new username for ${username}:`, username);
    if (!newUsername || newUsername === username) return;

    try {
      await api.patch(`/admin/users/${username}/edit/`, { username: newUsername });
      // Met à jour l'affichage localement
      setUsers(users.map(u => u.username === username ? { ...u, username: newUsername } : u));
    } catch (err) {
      alert(err.response?.data?.error || 'Could not update username.');
    }
  };

  if (loading) return <div><Navbar /><p style={{textAlign: 'center', marginTop: '40px'}}>Loading...</p></div>;
  
  if (error) return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2 style={{color: '#dc3545'}}>🛑 {error}</h2>
        <button onClick={() => navigate('/events')} className="btn-action btn-edit" style={{maxWidth: '200px'}}>
          ← Back to Events
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2>👥 Registered Accounts ({users.length})</h2>
        
        <div className="users-grid">
          {users.map(user => (
            <div className="user-card" key={user.id}>
              
              {/* En-tête : Avatar + Pseudo + Date */}
              <div className="user-card-header">
                <img src={user.avatar_url} alt={user.username} className="user-avatar" />
                <div className="user-info">
                  <h3 
                    className="user-name" 
                    onClick={() => navigate(`/${user.username}`)}
                    title="View Profile"
                  >
                    {user.username}
                    {user.is_staff && <span className="admin-badge">Admin</span>}
                  </h3>
                  <p className="user-date">Joined: {user.date_joined}</p>
                </div>
              </div>
              
              {/* Actions : Edit + Delete */}
              <div className="user-actions">
                <button 
                  className="btn-action btn-edit" 
                  onClick={() => handleEdit(user.username)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn-action btn-delete" 
                  onClick={() => handleDelete(user.username)}
                  disabled={user.username === currentUser.username}
                  title={user.username === currentUser.username ? "You cannot delete your own account here." : "Delete user"}
                >
                  🗑️ Delete
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