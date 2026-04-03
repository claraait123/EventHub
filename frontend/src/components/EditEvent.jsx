import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('planned');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chargement des données existantes de l'événement au montage du composant
  useEffect(() => {
  const fetchData = async () => {
    try {
      // Chargement de l'événement ET de l'utilisateur courant en parallèle
      const [eventRes, userRes] = await Promise.all([
        api.get(`/events/${id}/`),
        api.get('/me/')
      ]);

      const event = eventRes.data;
      const user = userRes.data;

      // Vérification des droits AVANT d'afficher le formulaire
      if (!user.is_staff && user.id !== event.creator) {
        navigate('/events'); // Redirige sans afficher le formulaire
        return;
      }

      // Autorisé : on remplit le formulaire
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
      // PATCH : envoie uniquement les champs modifiés
      await api.patch(`/events/${id}/`, {
        title,
        description,
        date,
        status,
      });
      navigate(`/events/${id}`); // Redirige vers la page de détail après succès
    } catch (err) {
      // 403 = l'utilisateur n'est pas autorisé (ni créateur, ni admin)
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
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #e1e4e8', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0 }}>Edit Event</h2>

        {error && <p style={{ color: 'red', backgroundColor: '#ffeef0', padding: '10px', borderRadius: '4px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
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
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            >
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              style={{ flex: 1, padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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