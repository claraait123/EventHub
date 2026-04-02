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

        <h3>Registered Participants</h3>
        {event.registrations && event.registrations.length > 0 ? (
          <ul>
            {event.registrations.map(reg => (
              <li key={reg.id}>Registration ID: {reg.id}</li>
            ))}
          </ul>
        ) : (
          <p>No participants registered yet.</p>
        )}
      </div>
    </div>
  );
}

export default EventDetails;