import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import EventCard from './EventCard';
import { useLanguage } from '../LanguageContext';

function EventList() {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = statusFilter ? `/events/?status=${statusFilter}` : '/events/';
        // Load events AND current user in parallel
        const [eventsRes, userRes, myEventsRes] = await Promise.all([
          api.get(url),
          api.get('/me/'),
          api.get('/my-events/')
        ]);
        setEvents(eventsRes.data);
        setCurrentUser(userRes.data);
        setJoinedEventIds(new Set(myEventsRes.data.map(e => e.id)));
      } catch (err) {
        setError(language === 'en' ? 'Error loading events.' : 'Erreur lors du chargement des événements.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [statusFilter, language]); // Added language to dependency array for error translation

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/join/`);
      setJoinedEventIds(prev => new Set([...prev, eventId]));
    } catch (err) {
      alert(err.response?.data?.error || (language === 'en' ? 'Could not join event.' : 'Impossible de rejoindre l\'événement.'));
    }
  };

  const handleLeave = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/leave/`);
      setJoinedEventIds(prev => { const next = new Set(prev); next.delete(eventId); return next; });
    } catch (err) {
      alert(language === 'en' ? 'Could not leave event.' : 'Impossible de quitter l\'événement.');
    }
  };

  const handleDelete = async (eventId, eventTitle) => {
    const confirmMessage = language === 'en' 
      ? `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.` 
      : `Êtes-vous sûr de vouloir supprimer "${eventTitle}" ? Cette action est irréversible.`;
      
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      await api.delete(`/events/${eventId}/`);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      alert(language === 'en' ? 'Could not delete event.' : 'Impossible de supprimer l\'événement.');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <div className="event-list-container">
           <h2 className="event-list-title">
             {language === 'en' ? 'All Events' : 'Tous les Événements'}
           </h2>
          <Link to="/add-event" id="AddEventButton">
            {language === 'en' ? '+ New Event' : '+ Nouvel Événement'}
          </Link>
        </div>

        {/* Search bar + status filter on the same line */}
        <div className="search">
          <input
            type="text"
            placeholder={language === 'en' ? 'Search by title...' : 'Rechercher par titre...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            <option value="">{language === 'en' ? 'All statuses' : 'Tous les statuts'}</option>
            <option value="planned">{language === 'en' ? 'Planned' : 'Planifié'}</option>
            <option value="ongoing">{language === 'en' ? 'Ongoing' : 'En cours'}</option>
            <option value="completed">{language === 'en' ? 'Completed' : 'Terminé'}</option>
            <option value="cancelled">{language === 'en' ? 'Cancelled' : 'Annulé'}</option>
          </select>
        </div>

        {loading && <p>{language === 'en' ? 'Loading...' : 'Chargement...'}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && filteredEvents.length === 0 && (
          <p style={{ color: '#777', fontStyle: 'italic' }}>
            {searchQuery 
              ? (language === 'en' ? `No events matching "${searchQuery}".` : `Aucun événement ne correspond à "${searchQuery}".`) 
              : (language === 'en' ? 'No events found.' : 'Aucun événement trouvé.')}
          </p>
        )}

        <div className="events-grid">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              currentUser={currentUser}
              joinedEventIds={joinedEventIds}
              setJoinedEventIds={setJoinedEventIds}
              onDelete={(id) => setEvents(prev => prev.filter(e => e.id !== id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventList;