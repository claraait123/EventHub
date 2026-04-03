import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Utilisateur connecté
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // On charge l'événement ET l'utilisateur courant en parallèle
        const [eventRes, userRes] = await Promise.all([
          api.get(`/events/${id}/`),
          api.get('/me/')
        ]);
        setEvent(eventRes.data);
        setCurrentUser(userRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Vérifie si le bouton Edit doit être affiché
  const canEdit = currentUser && event && (
    currentUser.is_staff || currentUser.id === event.creator
  );


  if (loading) return <div><Navbar /><p>Loading...</p></div>;
  if (!event) return <div><Navbar /><p>Event not found.</p></div>;

  const handleRemove = async (memberId, memberUsername) => {
    const confirmed = window.confirm(`Remove ${memberUsername} from this event?`);
    if (!confirmed) return;

    try {
      await api.post(`/events/${id}/remove/${memberId}/`);
      // Met à jour la liste localement sans recharger la page
      setEvent(prev => ({
        ...prev,
        members: prev.members.filter(m => m.id !== memberId)
      }));
    } catch (err) {
      alert('Could not remove participant.');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/events">← Back to Events</Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <h2 style={{ margin: 0 }}>{event.title}</h2>

          {/* Le bouton Edit n'est visible que pour l'auteur ou un admin */}
          {canEdit && (
            <button
              onClick={() => navigate(`/events/${id}/edit`)}
              style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              ✏️ Edit Event
            </button>
          )}
        </div>

        {/* Auteur de l'événement */}
        <p style={{ margin: '8px 0 16px 0', color: '#586069', fontSize: '14px' }}>
          Created by{' '}
          <span
            onClick={() => navigate(`/${event.creator_username}`)}
            style={{ color: '#0366d6', cursor: 'pointer', fontWeight: '500' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            {event.creator_username}
          </span>
        </p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Status:</strong> {event.status}</p>
        <p><strong>Description:</strong> {event.description || 'No description provided.'}</p>

        <h3>Registered Participants ({event.members ? event.members.length : 0})</h3>
        {event.members && event.members.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {event.members.map(member => (
              <li
                key={member.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e4e8',
                  backgroundColor: '#fafbfc',
                }}
              >
                {/* Avatar + pseudo cliquable vers le profil */}
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${member.username}`}
                  alt={member.username}
                  style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                />
                <span
                  onClick={() => navigate(`/${member.username}`)}
                  style={{ fontWeight: '500', cursor: 'pointer', flex: 1 }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  {member.username}
                </span>

                {/* Bouton Remove : visible uniquement pour le créateur et les admins */}
                {canEdit && (
                  <button
                    onClick={() => handleRemove(member.id, member.username)}
                    style={{
                      padding: '3px 10px', backgroundColor: '#dc3545', color: 'white',
                      border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#777', fontStyle: 'italic' }}>No participants yet. Be the first to join!</p>
        )}
      </div>
    </div>
  );
}

export default EventDetails;