require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const jobsRouter = require('./routes/jobs');

function createApp(database = db) {
  const app = express();
  app.locals.db = database;

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', async (req, res, next) => {
    try {
      await req.app.locals.db.query('SELECT 1');
      res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
      next(error);
    }
  });

  app.use('/api/jobs', jobsRouter);

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
