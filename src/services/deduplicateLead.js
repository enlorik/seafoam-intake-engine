'use strict';

const { getRedisClient } = require('../config/redis');
const env = require('../config/env');

// Deduplication is based on identity (who submitted from where),
// not on event uniqueness (when they submitted).
// This prevents the same person from being processed multiple times
// regardless of how many times they submit the same form.
function buildDedupKey(source, email) {
  return `lead:${source}:${email}`;
}

/**
 * Checks if we have already seen this lead recently.
 *
 * Returns:
 *   { isDuplicate: true }  — if the key exists in Redis
 *   { isDuplicate: false } — if the key is new; also sets the key with TTL
 */
async function deduplicateLead(lead) {
  const redis = await getRedisClient();
  const key = buildDedupKey(lead.source, lead.email);

  const existing = await redis.get(key);

  if (existing) {
    return { isDuplicate: true };
  }

  // Mark this lead as seen for the dedup window
  await redis.set(key, '1', { EX: env.redisDedupTtlSeconds });

  return { isDuplicate: false };
}

module.exports = { deduplicateLead };
