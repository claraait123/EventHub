import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar'; 
import EventCard from './EventCard';
import './UserProfile.css'; // Import du CSS

function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  
  const [statusFilter, setStatusFilter] = useState('all'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, userRes, myEventsRes] = await Promise.all([
          api.get(`/profiles/${username}/`),
          api.get('/me/'),
          api.get('/my-events/')
        ]);
        setProfile(profileRes.data);
        setCurrentUser(userRes.data);
        setJoinedEventIds(new Set(myEventsRes.data.map(e => e.id)));
      } catch (err) {
        setError('User not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) return <div><Navbar /><div className="user-profile-msg">Loading profile...</div></div>;
  if (error) return <div><Navbar /><div className="user-profile-msg error">{error}</div></div>;

  const filteredEvents = statusFilter === 'all' 
    ? profile.events 
    : profile.events.filter(event => event.status === statusFilter);

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${profile.username}'s account? All their events will also be deleted.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/profiles/${profile.username}/delete/`);
      navigate('/events'); 
    } catch (err) {
      alert(err.response?.data?.error || 'Could not delete account.');
    }
  };

  return (
    <div>
      <Navbar /> 
      <div className="user-profile-container">
        
        {/* En-tête du profil */}
        <div className="user-profile-header">
          <img
            src={profile.profile_picture}
            alt={`${profile.username}'s avatar`}
            className="user-profile-avatar"
          />
          <div className="user-profile-info">
            <h2 className="user-profile-name">{profile.username}'s Profile</h2>

            {/* Bouton visible uniquement pour les admins, et pas sur son propre profil */}
            {currentUser?.is_staff && currentUser?.username !== profile.username && (
              <button
                onClick={handleDeleteProfile}
                className="user-profile-delete-btn"
              >
                🗑️ Delete this account
              </button>
            )}
          </div>
        </div>

        {/* Barre de titre avec le filtre */}
        <div className="user-profile-filter-bar">
          <h3 className="user-profile-filter-title">Events created ({filteredEvents.length})</h3>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="user-profile-select"
          >
            <option value="all">All statuses</option>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Liste des événements */}
        <div className="user-profile-events">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              currentUser={currentUser}
              joinedEventIds={joinedEventIds}
              setJoinedEventIds={setJoinedEventIds}
              onDelete={(id) => setProfile(prev => ({
                ...prev,
                events: prev.events.filter(e => e.id !== id)
              }))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;