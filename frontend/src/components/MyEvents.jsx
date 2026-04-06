import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useLanguage } from '../LanguageContext';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();

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
      alert(language === 'en' ? 'Could not leave event.' : 'Impossible de quitter l\'événement.');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <p style={{ padding: '20px' }}>
          {language === 'en' ? 'Loading...' : 'Chargement...'}
        </p>
      </div>
    );
  }

  // Helper object to translate statuses for display
  const translatedStatus = {
    planned: language === 'en' ? 'Planned' : 'Planifié',
    ongoing: language === 'en' ? 'Ongoing' : 'En cours',
    completed: language === 'en' ? 'Completed' : 'Terminé',
    cancelled: language === 'en' ? 'Cancelled' : 'Annulé'
  };

  return (
    <div>
      <Navbar />
      <div className="my-events-container">
        <h2 className="my-events-title">
          {language === 'en' ? 'My Joined Events' : 'Mes Événements Rejoints'}
        </h2>

        {events.length === 0 ? (
          <div className="my-events-empty">
            <p className="my-events-empty-text">
              {language === 'en' 
                ? "You haven't joined any events yet." 
                : "Vous n'avez rejoint aucun événement pour le moment."}
            </p>
            <Link to="/events" className="my-events-browse-btn">
              {language === 'en' ? 'Browse Events' : 'Parcourir les événements'}
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
                    ✖ {language === 'en' ? 'Leave' : 'Quitter'}
                  </button>
                </div>

                <div className="my-event-card-meta">
                  <span>
                    <strong>{language === 'en' ? 'Date:' : 'Date :'}</strong> {event.date}
                  </span>
                  <span className="my-event-status-wrapper">
                    <strong>{language === 'en' ? 'Status:' : 'Statut :'}</strong>
                    {/* Dynamically generate the status badge class based on the raw status */}
                    <span className={`my-event-badge status-${event.status || 'default'}`}>
                      {translatedStatus[event.status] || event.status}
                    </span>
                  </span>
                </div>

                {event.description && (
                  <p className="my-event-card-desc">{event.description}</p>
                )}

                <Link to={`/events/${event.id}`} className="my-event-card-link">
                  {language === 'en' ? 'View details →' : 'Voir les détails →'}
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