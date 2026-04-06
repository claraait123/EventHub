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

  const translatedStatus = {
    planned: language === 'en' ? 'Planned' : 'Planifié',
    ongoing: language === 'en' ? 'Ongoing' : 'En cours',
    completed: language === 'en' ? 'Completed' : 'Terminé',
    cancelled: language === 'en' ? 'Cancelled' : 'Annulé'
  };

  return (
    <div>
      <Navbar />
      
      <div className="event-details-embed-container">
        <Link to="/events" style={{display: 'inline-block', marginBottom: '15px', textDecoration: 'none', color: '#0366d6'}}>
          {language === 'en' ? '← Back to events' : '← Retour aux événements'}
        </Link>

        <div className="event-details-embed-header">
          <h2 className="event-details-embed-title">{event.title}</h2>

          {canEdit && (
            <button
              onClick={() => navigate(`/events/${id}/edit`)}
              className="event-details-edit-btn"
            >
              ✏️ {language === 'en' ? 'Edit Event' : 'Modifier l\'événement'}
            </button>
          )}
        </div>

        <div className="event-details-embed-section">
          <div className="event-details-info-row">
            <span className="event-details-info-label">{language === 'en' ? 'Created by:' : 'Créé par :'}</span>
            <span
              onClick={() => navigate(`/${event.creator_username}`)}
              style={{cursor: 'pointer', color: '#0366d6'}}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              {event.creator_username}
            </span>
          </div>

          <div className="event-details-info-row">
            <span className="event-details-info-label">{language === 'en' ? 'Date:' : 'Date :'}</span>
            <span>{event.date}</span>
          </div>

          <div className="event-details-info-row">
            <span className="event-details-info-label">{language === 'en' ? 'Status:' : 'Statut :'}</span>
            <span>{translatedStatus[event.status] || event.status}</span>
          </div>
          
          <div style={{marginTop: '20px'}}>
            <span className="event-details-info-label">{language === 'en' ? 'Description:' : 'Description :'}</span>
            <div className="event-details-desc-box">
              {event.description || (language === 'en' ? 'No description provided.' : 'Aucune description fournie.')}
            </div>
          </div>
        </div>

        <div className="event-details-participants-section">
          <h3 style={{marginTop: 0, marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)'}}>
            {language === 'en' ? 'Registered Participants' : 'Participants Inscrits'} ({event.members ? event.members.length : 0})
          </h3>
          
          {event.members && event.members.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
              {event.members.map(member => (
                <div key={member.id} className="event-details-participant-item">
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
                </div>
              ))}
            </div>
          ) : (
            <p style={{color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0}}>
              {language === 'en' ? 'No participants yet. Be the first to join!' : 'Aucun participant pour l\'instant. Soyez le premier à rejoindre !'}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default EventDetails;