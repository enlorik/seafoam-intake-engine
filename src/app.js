'use strict';

const express = require('express');
const leadsRouter = require('./routes/leads');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Parse incoming JSON bodies (16 kb cap)
app.use(express.json({ limit: '16kb' }));

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'seafoam-intake-engine' });
});

app.use('/leads', leadsRouter);
app.use('/webhook', leadsRouter);

// ── 404 and error handling ────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

module.exports = app;
