import { useNavigate } from 'react-router-dom';
import api from '../api';

function EventCard({ event, currentUser, joinedEventIds, setJoinedEventIds, onDelete }) {
  const navigate = useNavigate();

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
      alert(err.response?.data?.error || 'Could not join event.');
    }
  };

  const handleLeave = async (e) => {
    e.stopPropagation();
    try {
      await api.post(`/events/${event.id}/leave/`);
      setJoinedEventIds(prev => { const next = new Set(prev); next.delete(event.id); return next; });
    } catch (err) {
      alert('Could not leave event.');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Delete "${event.title}"? This cannot be undone.`);
    if (!confirmed) return;
    try {
      await api.delete(`/events/${event.id}/`);
      onDelete && onDelete(event.id);
    } catch {
      alert('Could not delete event.');
    }
  };

  const statusColors = {
    planned:   { bg: 'var(--success-bg)', text: 'var(--success)' },
    ongoing:   { bg: 'var(--warning-bg)', text: 'var(--warning-text)' },
    completed: { bg: 'rgba(88, 166, 255, 0.1)', text: 'var(--primary-text)' },
    cancelled: { bg: 'var(--danger-bg)', text: 'var(--danger)' },
  };
  const statusStyle = statusColors[event.status] || { bg: '#f0f0f0', text: '#333' };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="event-custom-card"
    >
      {/* Ligne 1 : titre + boutons */}
      <div className='card-title'>
        <h4>{event.title}</h4>

        <div className="card-button-group" onClick={e => e.stopPropagation()}>
          {canEdit && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}/edit`); }}
                className="card-button edit-button"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="card-button delete-button"
              >
                🗑️ Delete
              </button>
            </>
          )}

          {currentUser && !isOwner && (
            isJoined ? (
              <button
                onClick={handleLeave}
                className="card-button leave-button"
              >
                ✖ Leave
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="card-button join-button"
              >
                ✚ Join
              </button>
            )
          )}
        </div>
      </div>

      {/* Ligne 2 : auteur + date + statut */}
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
          {event.status}
        </span>
      </div>
    </div>
  );
}

export default EventCard;