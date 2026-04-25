require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const tasksRouter = require('./routes/tasks');
const pool = require('./config/db');

// ✅ AUTO CREATE TABLE saat server pertama jalan
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id           SERIAL PRIMARY KEY,
        title        VARCHAR(255) NOT NULL,
        description  TEXT,
        is_completed BOOLEAN DEFAULT false,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel tasks siap!');
  } catch (err) {
    console.error('❌ Gagal buat tabel:', err.message);
  }
};

initDB(); // Jalankan saat server start

app.use(express.json());
app.use(logger);
app.use('/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.json({ message: '🚀 Task Manager API berjalan!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
