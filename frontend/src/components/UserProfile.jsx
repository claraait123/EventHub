import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar'; 
import EventCard from './EventCard';
import { useLanguage } from '../LanguageContext';

function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  
  const [statusFilter, setStatusFilter] = useState('all'); 
  const { language } = useLanguage();

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
        setError(language === 'en' ? 'User not found.' : 'Utilisateur introuvable.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, language]); // Added language to trigger error message translation if changed

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="user-profile-msg">
          {language === 'en' ? 'Loading profile...' : 'Chargement du profil...'}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="user-profile-msg error">{error}</div>
      </div>
    );
  }

  const filteredEvents = statusFilter === 'all' 
    ? profile.events 
    : profile.events.filter(event => event.status === statusFilter);

  const handleDeleteProfile = async () => {
    const confirmMessage = language === 'en'
      ? `Are you sure you want to permanently delete ${profile.username}'s account? All their events will also be deleted.`
      : `Êtes-vous sûr de vouloir supprimer définitivement le compte de ${profile.username} ? Tous ses événements seront également supprimés.`;

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      await api.delete(`/profiles/${profile.username}/delete/`);
      navigate('/events'); 
    } catch (err) {
      alert(err.response?.data?.error || (language === 'en' ? 'Could not delete account.' : 'Impossible de supprimer le compte.'));
    }
  };

  return (
    <div>
      <Navbar /> 
      <div className="user-profile-container">
        
        {/* Profile header */}
        <div className="user-profile-header">
          <img
            src={profile.profile_picture}
            alt={language === 'en' ? `${profile.username}'s avatar` : `Avatar de ${profile.username}`}
            className="user-profile-avatar"
          />
          <div className="user-profile-info">
            <h2 className="user-profile-name">
              {language === 'en' ? `${profile.username}'s Profile` : `Profil de ${profile.username}`}
            </h2>

            {/* Button visible only for admins and not on their own profile */}
            {currentUser?.is_staff && currentUser?.username !== profile.username && (
              <button
                onClick={handleDeleteProfile}
                className="user-profile-delete-btn"
              >
                🗑️ {language === 'en' ? 'Delete this account' : 'Supprimer ce compte'}
              </button>
            )}
          </div>
        </div>

        {/* Title bar with filter */}
        <div className="user-profile-filter-bar">
          <h3 className="user-profile-filter-title">
            {language === 'en' ? 'Events created' : 'Événements créés'} ({filteredEvents.length})
          </h3>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="user-profile-select"
          >
            <option value="all">{language === 'en' ? 'All status' : 'Tous les statuts'}</option>
            <option value="planned">{language === 'en' ? 'Planned' : 'Planifié'}</option>
            <option value="ongoing">{language === 'en' ? 'Ongoing' : 'En cours'}</option>
            <option value="completed">{language === 'en' ? 'Completed' : 'Terminé'}</option>
            <option value="cancelled">{language === 'en' ? 'Cancelled' : 'Annulé'}</option>
          </select>
        </div>

        {/* Event list */}
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