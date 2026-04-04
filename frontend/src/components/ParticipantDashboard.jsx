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
      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard des Participants</h2>
        <p className="dashboard-stats">
          Total des participants enregistrés : <strong>{participants.length}</strong>
        </p>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipantDashboard;