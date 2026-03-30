'use strict';

const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

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
