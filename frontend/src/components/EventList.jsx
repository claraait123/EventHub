import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

function EventList() {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = statusFilter ? `/events/?status=${statusFilter}` : '/events/';
        // On charge les événements ET l'utilisateur courant en parallèle
        const [eventsRes, userRes, myEventsRes] = await Promise.all([
          api.get(url),
          api.get('/me/'),
          api.get('/my-events/')
        ]);
        setEvents(eventsRes.data);
        setCurrentUser(userRes.data);
        setJoinedEventIds(new Set(myEventsRes.data.map(e => e.id)));
      } catch (err) {
        setError('Error loading events.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [statusFilter]);
  
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/join/`);
      setJoinedEventIds(prev => new Set([...prev, eventId]));
    } catch (err) {
      alert(err.response?.data?.error || 'Could not join event.');
    }
  };

  const handleLeave = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/leave/`);
      setJoinedEventIds(prev => { const next = new Set(prev); next.delete(eventId); return next; });
    } catch (err) {
      alert('Could not leave event.');
    }
  };

  const handleDelete = async (eventId, eventTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await api.delete(`/events/${eventId}/`);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      alert('Could not delete event.');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Events</h2>
          <Link to="/add-event" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>
            + New Event
          </Link>
        </div>

        {/* Barre de recherche + filtre statut sur la même ligne */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
          />
          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            <option value="">All statuses</option>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && filteredEvents.length === 0 && (
          <p style={{ color: '#777', fontStyle: 'italic' }}>
            {searchQuery ? `No events matching "${searchQuery}".` : 'No events found.'}
          </p>
        )}

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && events.length === 0 && <p>No events found.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredEvents.map(event =>  {
            // Vrai si l'utilisateur est l'auteur OU admin
            const canEdit = currentUser && (
              currentUser.is_staff || currentUser.id === event.creator
            );

            return (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                style={{
                  border: '1px solid #e1e4e8', borderRadius: '8px', padding: '16px',
                  backgroundColor: '#fafbfc', boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  cursor: 'pointer', 
                  transition: 'box-shadow 0.2s, background-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafbfc'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: 0, color: '#0366d6' }}>{event.title}</h4>

                  <p style={{ margin: '6px 0 4px 0', fontSize: '13px', color: '#586069' }}>
                    By{' '}
                    <span
                      onClick={(e) => { e.stopPropagation(); navigate(`/${event.creator_username}`); }}
                      style={{ color: '#0366d6', cursor: 'pointer', fontWeight: '500' }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      {event.creator_username}
                    </span>
                    {' '}· {event.date} · {event.status}
                  </p>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {canEdit && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}/edit`); }}
                          style={{ padding: '4px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(event.id, event.title); }}
                          style={{ padding: '4px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}

                    {currentUser && event.creator !== currentUser.id && (
                      joinedEventIds.has(event.id) ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleLeave(event.id); }}
                          style={{ padding: '4px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                        >
                          ✖ Leave
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleJoin(event.id); }}
                          style={{ padding: '4px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                        >
                          ✚ Join
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EventList;