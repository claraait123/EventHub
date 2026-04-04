import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get('/my-events/');
        setEvents(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const handleLeave = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/leave/`);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      alert('Could not leave event.');
    }
  };

  if (loading) return <div><Navbar /><p style={{ padding: '20px' }}>Loading...</p></div>;

  return (
    <div>
      <Navbar />
      <div className="my-events-container">
        <h2 className="my-events-title">My Joined Events</h2>

        {events.length === 0 ? (
          <div className="my-events-empty">
            <p className="my-events-empty-text">You haven't joined any events yet.</p>
            <Link to="/events" className="my-events-browse-btn">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="my-events-list">
            {events.map(event => (
              <div key={event.id} className="my-event-card">
                
                <div className="my-event-card-header">
                  <h4 className="my-event-card-title">{event.title}</h4>
                  <button
                    onClick={() => handleLeave(event.id)}
                    className="my-event-leave-btn"
                  >
                    ✖ Leave
                  </button>
                </div>

                <div className="my-event-card-meta">
                  <span><strong>Date:</strong> {event.date}</span>
                  <span className="my-event-status-wrapper">
                    <strong>Status:</strong>
                    {/* Dynamically generate the status badge class */}
                    <span className={`my-event-badge status-${event.status || 'default'}`}>
                      {event.status}
                    </span>
                  </span>
                </div>

                {event.description && (
                  <p className="my-event-card-desc">{event.description}</p>
                )}

                <Link to={`/events/${event.id}`} className="my-event-card-link">
                  View details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEvents;