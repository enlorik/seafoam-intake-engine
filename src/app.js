'use strict';

const express = require('express');
const leadsRouter = require('./routes/leads');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Parse incoming JSON bodies
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'seafoam-intake-engine' });
});

app.use('/leads', leadsRouter);

// ── 404 and error handling ────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

module.exports = app;
