import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

function AddEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('planned'); // Default status
  const [error, setError] = useState('');
  
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
      setError('Erreur lors de la création de l\'événement. Vérifiez les champs.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="add-event-container">
        <h2 className="add-event-title">Create a New Event</h2>
        
        {error && <p className="add-event-error">{error}</p>}
        
        <form onSubmit={handleSubmit} className="add-event-form">
          
          <div>
            <label className="add-event-label">Title *</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="e.g., Summer Music Festival"
              className="add-event-input"
            />
          </div>

          <div>
            <label className="add-event-label">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4" 
              placeholder="Details about the event..."
              className="add-event-input"
            />
          </div>

          <div>
            <label className="add-event-label">Date *</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
              className="add-event-input"
            />
          </div>

          <div>
            <label className="add-event-label">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="add-event-input"
              style={{ cursor: 'pointer' }}
            >
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="add-event-btn-submit"
          >
            Post Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;