const express = require('express');
const router = express.Router();
const db = require('../config/db');

// READ - Retrieve all events
router.get('/', (req, res, next) => {
  db.all("SELECT * FROM api_event", [], (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

// READ - Retrieve a specific event
router.get('/:id', (req, res, next) => {
  db.get("SELECT * FROM api_event WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: "Événement non trouvé" });
    res.json(row);
  });
});

// CREATE - Add a new event
router.post('/', (req, res, next) => {
  const { title, description, date, status } = req.body;
  // By default, status is 'planned' if not provided, like in Django
  const eventStatus = status || 'planned'; 

  const sql = `INSERT INTO api_event (title, description, date, status) VALUES (?, ?, ?, ?)`;
  
  // function(err) instead of () => allows using 'this.lastID' with sqlite3
  db.run(sql, [title, description || "", date, eventStatus], function(err) {
    if (err) return next(err);
    res.status(201).json({ id: this.lastID, title, description, date, status: eventStatus });
  });
});

// UPDATE - Update an event
router.put('/:id', (req, res, next) => {
  const { title, description, date, status } = req.body;
  const sql = `UPDATE api_event SET title = ?, description = ?, date = ?, status = ? WHERE id = ?`;
  
  db.run(sql, [title, description, date, status, req.params.id], function(err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: "Événement non trouvé" });
    res.json({ message: "Événement mis à jour avec succès", id: req.params.id });
  });
});

// DELETE - Delete an event
router.delete('/:id', (req, res, next) => {
  db.run("DELETE FROM api_event WHERE id = ?", [req.params.id], function(err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: "Événement non trouvé" });
    res.json({ message: "Événement supprimé avec succès" });
  });
});

module.exports = router;
