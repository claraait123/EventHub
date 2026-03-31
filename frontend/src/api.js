import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
fetch(`${apiUrl}/api/events`)

// Ajoute le token à chaque requête automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
