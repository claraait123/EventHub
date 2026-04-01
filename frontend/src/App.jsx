import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import ParticipantDashboard from './components/ParticipantDashboard';
import Register from './components/Register';
import UserProfile from './components/UserProfile';

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Routes protégées */}
        <Route path="/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
        <Route path="/participants" element={<ProtectedRoute><ParticipantDashboard /></ProtectedRoute>} />
        
        <Route path="/:username" element={<UserProfile />} />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/events" />} />
      </Routes>
    </Router>
  );
}

export default App;
