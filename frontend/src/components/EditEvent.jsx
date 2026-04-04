import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import './EditEvent.css'; // N'oublie pas l'import !

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('planned');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, userRes] = await Promise.all([
          api.get(`/events/${id}/`),
          api.get('/me/')
        ]);

        const event = eventRes.data;
        const user = userRes.data;

        if (!user.is_staff && user.id !== event.creator) {
          navigate('/events'); 
          return;
        }

        setTitle(event.title);
        setDescription(event.description || '');
        setDate(event.date);
        setStatus(event.status);

      } catch (err) {
        setError('Could not load event data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/events/${id}/`, {
        title,
        description,
        date,
        status,
      });
      navigate(`/events/${id}`); 
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You are not allowed to edit this event.');
      } else {
        setError('An error occurred while saving the event.');
      }
    }
  };

  if (loading) return <div><Navbar /><p style={{ padding: '20px' }}>Loading...</p></div>;

  return (
    <div>
      <Navbar />
      <div className="edit-event-container">
        <h2 className="edit-event-title">EDIT EVENT</h2>

        {error && <p className="edit-event-error">{error}</p>}

        <form onSubmit={handleSubmit} className="edit-event-form">
          <div>
            <label className="edit-event-label">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="edit-event-input"
            />
          </div>

          <div>
            <label className="edit-event-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="edit-event-input"
            />
          </div>

          <div>
            <label className="edit-event-label">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="edit-event-input"
            />
          </div>

          <div>
            <label className="edit-event-label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="edit-event-input"
            >
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="edit-event-buttons">
            <button
              type="submit"
              className="edit-event-btn edit-event-btn-submit"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="edit-event-btn edit-event-btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;