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
    planned:   { bg: '#e6ffed', text: '#28a745' },
    ongoing:   { bg: '#fffdef', text: '#b08800' },
    completed: { bg: '#f1f8ff', text: '#0366d6' },
    cancelled: { bg: '#ffeef0', text: '#cb2431' },
  };
  const statusStyle = statusColors[event.status] || { bg: '#f0f0f0', text: '#333' };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      style={{
        border: '1px solid #e1e4e8', borderRadius: '8px', padding: '16px',
        backgroundColor: '#fafbfc', boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        cursor: 'pointer', transition: 'box-shadow 0.2s, background-color 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4ff'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafbfc'}
    >
      {/* Ligne 1 : titre + boutons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <h4 style={{ margin: 0, color: '#0366d6', fontSize: '1rem' }}>{event.title}</h4>

        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {canEdit && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}/edit`); }}
                style={{ padding: '4px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                style={{ padding: '4px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
              >
                🗑️ Delete
              </button>
            </>
          )}

          {currentUser && !isOwner && (
            isJoined ? (
              <button
                onClick={handleLeave}
                style={{ padding: '4px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
              >
                ✖ Leave
              </button>
            ) : (
              <button
                onClick={handleJoin}
                style={{ padding: '4px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
              >
                ✚ Join
              </button>
            )
          )}
        </div>
      </div>

      {/* Ligne 2 : auteur + date + statut */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
        <img
          src={event.creator_avatar}
          alt={event.creator_username}
          style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <span
          onClick={(e) => { e.stopPropagation(); navigate(`/${event.creator_username}`); }}
          style={{ fontSize: '13px', color: '#0366d6', cursor: 'pointer', fontWeight: '500' }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
        >
          {event.creator_username}
        </span>
        <span style={{ color: '#ccc' }}>·</span>
        <span style={{ fontSize: '13px', color: '#586069' }}>{event.date}</span>
        <span style={{ color: '#ccc' }}>·</span>
        <span style={{
          fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '12px',
          backgroundColor: statusStyle.bg, color: statusStyle.text
        }}>
          {event.status}
        </span>
      </div>
    </div>
  );
}

export default EventCard;