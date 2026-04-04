import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar'; 
import EventCard from './EventCard';

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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

  const filteredEvents = statusFilter === 'all' 
    ? profile.events 
    : profile.events.filter(event => event.status === statusFilter);

  // Fonction pour donner une couleur différente selon le statut
  const getStatusStyle = (status) => {
    switch(status) {
      case 'planned': return { bg: '#e6ffed', text: '#28a745' }; // Vert
      case 'ongoing': return { bg: '#fffdef', text: '#b08800' }; // Jaune
      case 'completed': return { bg: '#f1f8ff', text: '#0366d6' }; // Bleu
      case 'cancelled': return { bg: '#ffeef0', text: '#cb2431' }; // Rouge
      default: return { bg: '#f0f0f0', text: '#333' };
    }
  };

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${profile.username}'s account? All their events will also be deleted.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/profiles/${profile.username}/delete/`);
      navigate('/events'); // redirige vers la liste après suppression
    } catch (err) {
      alert(err.response?.data?.error || 'Could not delete account.');
    }
  };

  return (
    <div>
      <Navbar /> 
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* En-tête du profil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #eee' }}>
          <img 
            src={profile.profile_picture} 
            alt={`${profile.username}'s avatar`} 
            style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f0f0f0' }}
          />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{profile.username}'s Profile</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #eee' }}>
            <img
              src={profile.profile_picture}
              alt={`${profile.username}'s avatar`}
              style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f0f0f0', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>{profile.username}'s Profile</h2>

              {/* Bouton visible uniquement pour les admins, et pas sur son propre profil */}
              {currentUser?.is_staff && currentUser?.username !== profile.username && (
                <button
                  onClick={handleDeleteProfile}
                  style={{
                    padding: '6px 14px', backgroundColor: '#dc3545', color: 'white',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  🗑️ Delete this account
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. NOUVEAU : Barre de titre avec le filtre (Menu déroulant) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Events created ({filteredEvents.length})</h3>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            <option value="all">All statuses</option>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Liste des événements (Utilisation de filteredEvents au lieu de profile.events) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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