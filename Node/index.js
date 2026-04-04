const express = require('express');
require('dotenv').config();
const eventRoutes = require('./routes/events');
const participantRoutes = require('./routes/participants');

const app = express();

// Middleware to parse JSON sent in POST/PUT requests
app.use(express.json());

// Main routes (reproduce Django DefaultRouter behavior)
app.use('/events', eventRoutes);
app.use('/participants', participantRoutes);

// Basic error-handling middleware
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.message);
  res.status(500).json({ error: "Une erreur interne est survenue sur le serveur Node.js" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur Node démarré sur le port ${PORT}`);
  console.log(`Testez l'API sur http://localhost:${PORT}/events`);
});
