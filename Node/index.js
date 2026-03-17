const express = require('express');
require('dotenv').config();
const eventRoutes = require('./routes/events');
const participantRoutes = require('./routes/participants');

const app = express();

// Middleware pour parser le JSON envoyé dans les requêtes POST/PUT
app.use(express.json());

// Routes principales (Reproduit le comportement de votre DefaultRouter Django)
app.use('/events', eventRoutes);
app.use('/participants', participantRoutes);

// Middleware basique de gestion des erreurs (Requis par le Lab 8)
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.message);
  res.status(500).json({ error: "Une erreur interne est survenue sur le serveur Node.js" });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur Node démarré sur le port ${PORT}`);
  console.log(`Testez l'API sur http://localhost:${PORT}/events`);
});
