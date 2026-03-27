'use strict';

const express = require('express');
const env = require('./config/env');
const logger = require('./utils/logger');
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

// ── Start ─────────────────────────────────────────────────────────────────────

const server = app.listen(env.port, () => {
  logger.info({
    event: 'server_started',
    message: `seafoam-intake-engine listening on port ${env.port}`,
    port: env.port,
    env: env.nodeEnv,
  });
});

module.exports = { app, server };
