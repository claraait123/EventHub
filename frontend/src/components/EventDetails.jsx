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

        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Status:</strong> {event.status}</p>
        <p><strong>Description:</strong> {event.description || 'No description provided.'}</p>

        <h3>Registered Participants ({event.members ? event.members.length : 0})</h3>
        {event.members && event.members.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {event.members.map(member => (
              <li
                key={member.id}
                onClick={() => navigate(`/${member.username}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e4e8',
                  cursor: 'pointer', backgroundColor: '#fafbfc',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafbfc'}
              >
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${member.username}`}
                  alt={member.username}
                  style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                />
                <span style={{ fontWeight: '500' }}>{member.username}</span>
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