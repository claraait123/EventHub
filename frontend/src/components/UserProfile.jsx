import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar'; 

function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 1. NOUVEAU : État pour mémoriser le filtre choisi par l'utilisateur
  const [statusFilter, setStatusFilter] = useState('all'); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profiles/${username}/`);
        setProfile(response.data);
      } catch (err) {
        setError('User not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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
        {filteredEvents.length === 0 ? (
          <p style={{ color: '#777', fontStyle: 'italic' }}>No events found for this status.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredEvents.map(event => {
              const statusColors = getStatusStyle(event.status);

              return (
                <div key={event.id} style={{ border: '1px solid #e1e4e8', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', backgroundColor: '#fafbfc' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#0366d6', fontSize: '1.2rem' }}>{event.title}</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px', color: '#586069' }}>
                    <p style={{ margin: 0 }}><strong>Author:</strong> {profile.username}</p>
                    <p style={{ margin: 0 }}><strong>Date:</strong> {event.date}</p>
                    
                    {/* 4. NOUVEAU : Affichage clair du statut sous forme de badge coloré */}
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong>Status:</strong> 
                      <span style={{ 
                        textTransform: 'capitalize', 
                        fontWeight: 'bold', 
                        padding: '4px 10px', 
                        borderRadius: '12px',
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        fontSize: '12px'
                      }}>
                        {event.status}
                      </span>
                    </p>
                  </div>
                  
                  {event.description && (
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eaecef', color: '#24292e', fontSize: '14px' }}>
                      {event.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;