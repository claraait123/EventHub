const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const db = new sqlite3.Database(process.env.DB_PATH, (err) => {
  if (err) {
    console.error("Erreur de connexion à SQLite:", err.message);
  } else {
    console.log("Connecté à la base de données SQLite de Django.");
  }
});

module.exports = db;
