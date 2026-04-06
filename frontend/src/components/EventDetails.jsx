import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useLanguage } from '../LanguageContext';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

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

  if (loading) {
    return (
      <div>
        <Navbar />
        <p className="messages">
          {language === 'en' ? 'Loading...' : 'Chargement...'}
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <Navbar />
        <p className="messages">
          {language === 'en' ? 'Event not found.' : 'Événement introuvable.'}
        </p>
      </div>
    );
  }

  const handleRemove = async (memberId, memberUsername) => {
    const confirmMessage = language === 'en'
      ? `Remove ${memberUsername} from this event?`
      : `Retirer ${memberUsername} de cet événement ?`;
      
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      await api.post(`/events/${id}/remove/${memberId}/`);
      setEvent(prev => ({
        ...prev,
        members: prev.members.filter(m => m.id !== memberId)
      }));
    } catch (err) {
      alert(language === 'en' ? 'Could not remove participant.' : 'Impossible de retirer le participant.');
    }
  };

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
      <div className="event-details-container">
        <Link to="/events" className="event-details-link">
          {language === 'en' ? 'Click here to see more events' : 'Cliquez ici pour voir plus d\'événements'}
        </Link>

        <div className="event-details-header">
          <h2 className="event-details-title">{event.title}</h2>

          {canEdit && (
            <button
              onClick={() => navigate(`/events/${id}/edit`)}
              className="event-details-edit-btn"
            >
              ✏️ {language === 'en' ? 'Edit Event' : 'Modifier l\'événement'}
            </button>
          )}
        </div>

        <p className="event-details-creator-info">
          {language === 'en' ? 'Created by ' : 'Créé par '}
          <span
            onClick={() => navigate(`/${event.creator_username}`)}
            className="event-details-link"
          >
            {event.creator_username}
          </span>
        </p>
        
        <p><strong>{language === 'en' ? 'Date:' : 'Date :'}</strong> {event.date}</p>
        <p><strong>{language === 'en' ? 'Status:' : 'Statut :'}</strong> {translatedStatus[event.status] || event.status}</p>
        <p>
          <strong>{language === 'en' ? 'Description:' : 'Description :'}</strong>{' '}
          {event.description || (language === 'en' ? 'No description provided.' : 'Aucune description fournie.')}
        </p>

        <h3>
          {language === 'en' ? 'Registered Participants' : 'Participants Inscrits'} ({event.members ? event.members.length : 0})
        </h3>
        
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
                    {language === 'en' ? 'Remove' : 'Retirer'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="event-details-empty">
            {language === 'en' ? 'No participants yet. Be the first to join!' : 'Aucun participant pour l\'instant. Soyez le premier à rejoindre !'}
          </p>
        )}
      </div>
    </div>
  );
}

export default EventDetails;