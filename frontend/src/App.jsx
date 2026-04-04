import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';
import Login from './components/Login';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import ParticipantDashboard from './components/ParticipantDashboard';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import AddEvent from './components/AddEvent';
import EditEvent from './components/EditEvent';
import MyEvents from './components/MyEvents';
import Settings from './components/Settings';
import Footer from './components/Footer';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
            <Route path="/add-event" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
            <Route path="/participants" element={<ProtectedRoute><ParticipantDashboard /></ProtectedRoute>} />
            <Route path="/:username" element={<UserProfile />} />
            <Route path="/events/:id/edit" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
            <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/events" />} />
          </Routes>
        </div>
        
        <Footer />
        
        <ThemeToggle />
        
      </div>
    </Router>
  );
}

export default App;