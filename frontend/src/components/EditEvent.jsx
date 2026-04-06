import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useLanguage } from '../LanguageContext';

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

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
        setError(
          language === 'en' 
            ? 'Could not load event data.' 
            : 'Impossible de charger les données de l\'événement.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, language, navigate]); // Added language to dependency array to update errors if toggled

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
        setError(
          language === 'en' 
            ? 'You are not allowed to edit this event.' 
            : 'Vous n\'êtes pas autorisé à modifier cet événement.'
        );
      } else {
        setError(
          language === 'en' 
            ? 'An error occurred while saving the event.' 
            : 'Une erreur s\'est produite lors de l\'enregistrement de l\'événement.'
        );
      }
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

  return (
    <div>
      <Navbar />
      <div className="edit-event-container">
        <h2 className="edit-event-title">
          {language === 'en' ? 'EDIT EVENT' : 'MODIFIER L\'ÉVÉNEMENT'}
        </h2>

        {error && <p className="edit-event-error">{error}</p>}

        <form onSubmit={handleSubmit} className="edit-event-form">
          <div>
            <label className="edit-event-label">
              {language === 'en' ? 'Title *' : 'Titre *'}
            </label>
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
            <label className="edit-event-label">
              {language === 'en' ? 'Date *' : 'Date *'}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="edit-event-input"
            />
          </div>

          <div>
            <label className="edit-event-label">
              {language === 'en' ? 'Status' : 'Statut'}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="edit-event-input"
            >
              <option value="planned">{language === 'en' ? 'Planned' : 'Planifié'}</option>
              <option value="ongoing">{language === 'en' ? 'Ongoing' : 'En cours'}</option>
              <option value="completed">{language === 'en' ? 'Completed' : 'Terminé'}</option>
              <option value="cancelled">{language === 'en' ? 'Cancelled' : 'Annulé'}</option>
            </select>
          </div>

          <div className="edit-event-buttons">
            <button
              type="submit"
              className="edit-event-btn edit-event-btn-submit"
            >
              {language === 'en' ? 'Save Changes' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="edit-event-btn edit-event-btn-cancel"
            >
              {language === 'en' ? 'Cancel' : 'Annuler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;