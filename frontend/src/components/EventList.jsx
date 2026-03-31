import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Utilise le filtre DjangoFilterBackend de votre views.py
        const url = statusFilter ? `/events/?status=${statusFilter}` : '/events/';
        const response = await api.get(url);
        setEvents(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des événements.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [statusFilter]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Liste des Événements</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label>Filtrer par statut : </label>
          <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
            <option value="">Tous les statuts</option>
            <option value="planned">Planifié</option>
            <option value="ongoing">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        {loading && <p>Chargement...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && events.length === 0 && (
          <p>Aucun événement trouvé. Ajoutez-en via l'interface Admin Django !</p>
        )}

        <ul>
          {events.map(event => (
            <li key={event.id} style={{ marginBottom: '10px' }}>
              <strong>{event.title}</strong> - {event.date} ({event.status})
              <br />
              <Link to={`/events/${event.id}`}>Voir les détails</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventList;
