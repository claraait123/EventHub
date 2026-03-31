import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from './Navbar';

function ParticipantDashboard() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await api.get('/participants/');
        setParticipants(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Dashboard des Participants</h2>
        <p>Total des participants enregistrés : <strong>{participants.length}</strong></p>

        {loading ? <p>Chargement...</p> : (
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p.id}>
                  <td>{p.first_name}</td>
                  <td>{p.last_name}</td>
                  <td>{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ParticipantDashboard;
