'use strict';

const { createClient } = require('redis');
const env = require('./env');
const logger = require('../utils/logger');

let client;

async function getRedisClient() {
  if (client) return client;

  client = createClient({ url: env.redisUrl });

  client.on('error', (err) => {
    logger.error({ event: 'redis_error', message: 'Redis client error', error: err.message });
  });

  await client.connect();
  return client;
}

module.exports = { getRedisClient };
