import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}/`);
        setEvent(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) return <div><Navbar /><p>Chargement...</p></div>;
  if (!event) return <div><Navbar /><p>Événement introuvable.</p></div>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Link to="/events">← Retour aux événements</Link>
        <h2>{event.title}</h2>
        <p><strong>Date :</strong> {event.date}</p>
        <p><strong>Statut :</strong> {event.status}</p>
        <p><strong>Description :</strong> {event.description || "Aucune description fournie."}</p>
        
        <h3>Participants inscrits</h3>
        {event.registrations && event.registrations.length > 0 ? (
          <ul>
            {event.registrations.map(reg => (
               <li key={reg.id}>Inscription ID: {reg.id}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun participant n'est encore inscrit à cet événement.</p>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
