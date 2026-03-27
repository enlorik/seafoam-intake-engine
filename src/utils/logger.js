'use strict';

const env = require('../config/env');

function log(level, fields) {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    service: 'seafoam-intake-engine',
    env: env.nodeEnv,
    ...fields,
  };
  // Write all logs to stdout as newline-delimited JSON
  process.stdout.write(JSON.stringify(entry) + '\n');
}

const logger = {
  info: (fields) => log('info', fields),
  warn: (fields) => log('warn', fields),
  error: (fields) => log('error', fields),
};

module.exports = logger;
