import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useLanguage } from '../LanguageContext';

function AddEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('planned'); // Default status
  const [error, setError] = useState('');
  const { language } = useLanguage();
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to the Django API
      await api.post('/events/', {
        title,
        description,
        date,
        status
      });
      
      // On success, redirect the user to the event list
      navigate('/events');
    } catch (err) {
      console.error(err);
      setError(
        language === 'en' 
          ? 'Error creating the event. Please check the fields.' 
          : 'Erreur lors de la création de l\'événement. Vérifiez les champs.'
      );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="add-event-container">
        <h2 className="add-event-title">
          {language === 'en' ? 'Create a New Event' : 'Créer un Nouvel Événement'}
        </h2>
        
        {error && <p className="add-event-error">{error}</p>}
        
        <form onSubmit={handleSubmit} className="add-event-form">
          
          <div>
            <label className="add-event-label">
              {language === 'en' ? 'Title *' : 'Titre *'}
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder={language === 'en' ? 'e.g., Summer Music Festival' : 'ex., Festival de Musique d\'Été'}
              className="add-event-input"
            />
          </div>

          <div>
            <label className="add-event-label">
              {language === 'en' ? 'Description' : 'Description'}
            </label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4" 
              placeholder={language === 'en' ? 'Details about the event...' : 'Détails sur l\'événement...'}
              className="add-event-input"
            />
          </div>

          <div>
            <label className="add-event-label">
              {language === 'en' ? 'Date *' : 'Date *'}
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
              className="add-event-input"
            />
          </div>

          <div>
            <label className="add-event-label">
              {language === 'en' ? 'Status' : 'Statut'}
            </label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="add-event-input"
              style={{ cursor: 'pointer' }}
            >
              <option value="planned">{language === 'en' ? 'Planned' : 'Planifié'}</option>
              <option value="ongoing">{language === 'en' ? 'Ongoing' : 'En cours'}</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="add-event-btn-submit"
          >
            {language === 'en' ? 'Post Event' : 'Créer l\'événement'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;