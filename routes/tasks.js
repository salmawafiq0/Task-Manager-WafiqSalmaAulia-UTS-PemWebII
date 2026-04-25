const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// GET /tasks/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Task dengan ID ${id} tidak ditemukan.` });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// POST /tasks
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Field "title" tidak boleh kosong atau hanya berisi spasi.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description || null]
    );
    res.status(201).json({ success: true, message: 'Task berhasil ditambahkan.', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// PUT /tasks/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, is_completed } = req.body;
  try {
    const check = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Task dengan ID ${id} tidak ditemukan.` });
    }
    const existing = check.rows[0];
    const updatedTitle       = title        !== undefined ? title.trim() : existing.title;
    const updatedDescription = description  !== undefined ? description  : existing.description;
    const updatedCompleted   = is_completed !== undefined ? is_completed : existing.is_completed;

    const result = await pool.query(
      'UPDATE tasks SET title=$1, description=$2, is_completed=$3 WHERE id=$4 RETURNING *',
      [updatedTitle, updatedDescription, updatedCompleted, id]
    );
    res.status(200).json({ success: true, message: 'Task berhasil diupdate.', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Task dengan ID ${id} tidak ditemukan.` });
    }
    res.status(200).json({ success: true, message: `Task dengan ID ${id} berhasil dihapus.`, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
