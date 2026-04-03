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

  const getStatusStyle = (status) => {
    switch(status) {
      case 'planned':   return { bg: '#e6ffed', text: '#28a745' };
      case 'ongoing':   return { bg: '#fffdef', text: '#b08800' };
      case 'completed': return { bg: '#f1f8ff', text: '#0366d6' };
      case 'cancelled': return { bg: '#ffeef0', text: '#cb2431' };
      default:          return { bg: '#f0f0f0', text: '#333' };
    }
  };

  if (loading) return <div><Navbar /><p style={{ padding: '20px' }}>Loading...</p></div>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ marginBottom: '24px' }}>My Joined Events</h2>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#777' }}>
            <p style={{ fontSize: '18px', marginBottom: '16px' }}>You haven't joined any events yet.</p>
            <Link to="/events" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
              Browse Events
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map(event => {
              const statusColors = getStatusStyle(event.status);
              return (
                <div key={event.id} style={{ border: '1px solid #e1e4e8', borderRadius: '8px', padding: '20px', backgroundColor: '#fafbfc', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, color: '#0366d6', fontSize: '1.1rem' }}>{event.title}</h4>
                    <button
                      onClick={() => handleLeave(event.id)}
                      style={{ padding: '4px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      ✖ Leave
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#586069', marginBottom: '10px' }}>
                    <span><strong>Date:</strong> {event.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong>Status:</strong>
                      <span style={{ padding: '2px 10px', borderRadius: '12px', backgroundColor: statusColors.bg, color: statusColors.text, fontWeight: 'bold', fontSize: '12px', textTransform: 'capitalize' }}>
                        {event.status}
                      </span>
                    </span>
                  </div>

                  {event.description && (
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#444' }}>{event.description}</p>
                  )}

                  <Link to={`/events/${event.id}`} style={{ fontSize: '13px', color: '#0366d6' }}>
                    View details →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEvents;