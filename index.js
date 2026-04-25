require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const tasksRouter = require('./routes/tasks');

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
