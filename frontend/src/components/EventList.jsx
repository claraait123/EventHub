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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = statusFilter ? `/events/?status=${statusFilter}` : '/events/';
        // On charge les événements ET l'utilisateur courant en parallèle
        const [eventsRes, userRes] = await Promise.all([
          api.get(url),
          api.get('/me/')
        ]);
        setEvents(eventsRes.data);
        setCurrentUser(userRes.data); 
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
              <div key={event.id} style={{ border: '1px solid #e1e4e8', borderRadius: '8px', padding: '16px', backgroundColor: '#fafbfc', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                
                {/* En-tête de la carte avec titre + bouton Edit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: 0, color: '#0366d6' }}>{event.title}</h4>
                  
                  {/* Bouton Edit visible seulement si autorisé */}
                  {canEdit && (
                    <button
                      onClick={() => navigate(`/events/${event.id}/edit`)}
                      style={{ padding: '4px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>

                <p style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#586069' }}>
                  <strong>Date:</strong> {event.date} &nbsp;|&nbsp; <strong>Status:</strong> {event.status}
                </p>
                <Link to={`/events/${event.id}`} style={{ fontSize: '14px' }}>View details →</Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EventList;