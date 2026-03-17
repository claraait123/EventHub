const express = require('express');
const router = express.Router();
const db = require('../config/db');

// READ - Récupérer tous les participants
router.get('/', (req, res, next) => {
  db.all("SELECT * FROM api_participant", [], (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

// READ - Récupérer un participant spécifique
router.get('/:id', (req, res, next) => {
  db.get("SELECT * FROM api_participant WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: "Participant non trouvé" });
    res.json(row);
  });
});

// CREATE - Ajouter un nouveau participant
router.post('/', (req, res, next) => {
  const { first_name, last_name, email } = req.body;

  // Vérification basique des champs obligatoires
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: "Les champs first_name, last_name et email sont obligatoires." });
  }

  const sql = `INSERT INTO api_participant (first_name, last_name, email) VALUES (?, ?, ?)`;
  
  db.run(sql, [first_name, last_name, email], function(err) {
    if (err) {
      // Gestion de l'erreur d'unicité de l'email (contrainte unique=True dans Django)
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: "Cet email est déjà utilisé par un autre participant." });
      }
      return next(err);
    }
    res.status(201).json({ id: this.lastID, first_name, last_name, email });
  });
});

// UPDATE - Modifier un participant
router.put('/:id', (req, res, next) => {
  const { first_name, last_name, email } = req.body;
  
  const sql = `UPDATE api_participant SET first_name = ?, last_name = ?, email = ? WHERE id = ?`;
  
  db.run(sql, [first_name, last_name, email, req.params.id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: "Cet email est déjà utilisé." });
      }
      return next(err);
    }
    if (this.changes === 0) return res.status(404).json({ error: "Participant non trouvé" });
    res.json({ message: "Participant mis à jour avec succès", id: req.params.id });
  });
});

// DELETE - Supprimer un participant
router.delete('/:id', (req, res, next) => {
  db.run("DELETE FROM api_participant WHERE id = ?", [req.params.id], function(err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: "Participant non trouvé" });
    res.json({ message: "Participant supprimé avec succès" });
  });
});

module.exports = router;
