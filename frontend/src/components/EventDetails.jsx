import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import './EventDetails.css'; 

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const canEdit = currentUser && event && (
    currentUser.is_staff || currentUser.id === event.creator
  );

  if (loading) return <div><Navbar /><p className="messages">Loading...</p></div>;
  if (!event) return <div><Navbar /><p className="messages">Event not found.</p></div>;

  const handleRemove = async (memberId, memberUsername) => {
    const confirmed = window.confirm(`Remove ${memberUsername} from this event?`);
    if (!confirmed) return;

    try {
      await api.post(`/events/${id}/remove/${memberId}/`);
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
      <div className="event-details-container">
        <Link to="/events" className="event-details-link">Click here to see more events</Link>

        <div className="event-details-header">
          <h2 className="event-details-title">{event.title}</h2>

          {canEdit && (
            <button
              onClick={() => navigate(`/events/${id}/edit`)}
              className="event-details-edit-btn"
            >
              ✏️ Edit Event
            </button>
          )}
        </div>

        <p className="event-details-creator-info">
          Created by{' '}
          <span
            onClick={() => navigate(`/${event.creator_username}`)}
            className="event-details-link"
          >
            {event.creator_username}
          </span>
        </p>
        
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Status:</strong> {event.status}</p>
        <p><strong>Description:</strong> {event.description || 'No description provided.'}</p>

        <h3>Registered Participants ({event.members ? event.members.length : 0})</h3>
        
        {event.members && event.members.length > 0 ? (
          <ul className="event-details-participants-list">
            {event.members.map(member => (
              <li key={member.id} className="event-details-participant-item">
                <img
                  src={member.avatar_url}
                  alt={member.username}
                  className="event-details-avatar"
                />
                <span
                  onClick={() => navigate(`/${member.username}`)}
                  className="event-details-username"
                >
                  {member.username}
                </span>

                {canEdit && (
                  <button
                    onClick={() => handleRemove(member.id, member.username)}
                    className="event-details-remove-btn"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="event-details-empty">No participants yet. Be the first to join!</p>
        )}
      </div>
    </div>
  );
}

export default EventDetails;