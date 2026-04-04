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
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #e1e4e8', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>Create a New Event</h2>
        
        {error && <p style={{ color: 'red', backgroundColor: '#ffeef0', padding: '10px', borderRadius: '4px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="e.g., Summer Music Festival"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4" 
              placeholder="Details about the event..."
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date *</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', cursor: 'pointer' }}
            >
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button 
            type="submit" 
            style={{ padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}
          >
            Post Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;