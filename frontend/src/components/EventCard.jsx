import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useLanguage } from '../LanguageContext';

function EventCard({ event, currentUser, joinedEventIds, setJoinedEventIds, onDelete }) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const canEdit = currentUser && (
    currentUser.is_staff || currentUser.id === event.creator
  );
  const isJoined = joinedEventIds?.has(event.id);
  const isOwner = currentUser && event.creator === currentUser.id;

  const handleJoin = async (e) => {
    e.stopPropagation();
    try {
      await api.post(`/events/${event.id}/join/`);
      setJoinedEventIds(prev => new Set([...prev, event.id]));
    } catch (err) {
      alert(err.response?.data?.error || (language === 'en' ? 'Could not join event.' : 'Impossible de rejoindre l\'événement.'));
    }
  };

  const handleLeave = async (e) => {
    e.stopPropagation();
    try {
      await api.post(`/events/${event.id}/leave/`);
      setJoinedEventIds(prev => { const next = new Set(prev); next.delete(event.id); return next; });
    } catch (err) {
      alert(language === 'en' ? 'Could not leave event.' : 'Impossible de quitter l\'événement.');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmMessage = language === 'en' 
      ? `Delete "${event.title}"? This cannot be undone.` 
      : `Supprimer "${event.title}" ? Cette action est irréversible.`;
      
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;
    try {
      await api.delete(`/events/${event.id}/`);
      onDelete && onDelete(event.id);
    } catch {
      alert(language === 'en' ? 'Could not delete event.' : 'Impossible de supprimer l\'événement.');
    }
  };

  const statusColors = {
    planned:   { bg: 'var(--success-bg)', text: 'var(--success)' },
    ongoing:   { bg: 'var(--warning-bg)', text: 'var(--warning-text)' },
    completed: { bg: 'rgba(88, 166, 255, 0.1)', text: 'var(--primary-text)' },
    cancelled: { bg: 'var(--danger-bg)', text: 'var(--danger)' },
  };
  const statusStyle = statusColors[event.status] || { bg: '#f0f0f0', text: '#333' };

  // Helper object to translate statuses for display
  const translatedStatus = {
    planned: language === 'en' ? 'Planned' : 'Planifié',
    ongoing: language === 'en' ? 'Ongoing' : 'En cours',
    completed: language === 'en' ? 'Completed' : 'Terminé',
    cancelled: language === 'en' ? 'Cancelled' : 'Annulé'
  };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="event-custom-card"
    >
      {/* Line 1 : title + buttons */}
      <div className='card-title'>
        <h4>{event.title}</h4>

        <div className="card-button-group" onClick={e => e.stopPropagation()}>
          {canEdit && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}/edit`); }}
                className="card-button edit-button"
              >
                ✏️ {language === 'en' ? 'Edit' : 'Modifier'}
              </button>
              <button
                onClick={handleDelete}
                className="card-button delete-button"
              >
                🗑️ {language === 'en' ? 'Delete' : 'Supprimer'}
              </button>
            </>
          )}

          {currentUser && !isOwner && (
            isJoined ? (
              <button
                onClick={handleLeave}
                className="card-button leave-button"
              >
                ✖ {language === 'en' ? 'Leave' : 'Quitter'}
              </button>
            ) : event.status !== 'cancelled' && event.status !== 'completed' ? (
              <button
                onClick={handleJoin}
                className="card-button join-button"
              >
                ✚ {language === 'en' ? 'Join' : 'Rejoindre'}
              </button>
            ) : null
          )}
        </div>
      </div>

      {/* Line 2 : author + date + status */}
      <div className="card-infos">
        <img
          src={event.creator_avatar}
          alt={event.creator_username}
          className = "card-pfp"
        />
        <span
          onClick={(e) => { e.stopPropagation(); navigate(`/${event.creator_username}`); }}
          className = "card-creator"
          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
        >
          {event.creator_username}
        </span>
        <span className="card-info-separator">·</span>
        <span className='card-date'>{event.date}</span>
        <span className="card-info-separator">·</span>
        <span className="card-status" style={{backgroundColor: statusStyle.bg, color: statusStyle.text}}>
          {translatedStatus[event.status] || event.status}
        </span>
      </div>
    </div>
  );
}

export default EventCard;