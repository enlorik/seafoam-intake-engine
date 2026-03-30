'use strict';

const logger = require('../utils/logger');

const DEFAULT_MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

/**
 * Retries an async function with exponential backoff.
 *
 * @param {Function} fn        - Async function to call. Must return a promise.
 * @param {object}   options
 * @param {number}   options.maxRetries - Maximum number of attempts after the first (default 3)
 * @param {string}   options.context    - Label used in log entries (e.g. destination name)
 */
async function withRetry(fn, { maxRetries = DEFAULT_MAX_RETRIES, context = 'unknown' } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      const isLastAttempt = attempt === maxRetries + 1;
      if (isLastAttempt) break;

      const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);

      logger.warn({
        event: 'retry_scheduled',
        message: `Retrying ${context} after failure`,
        context,
        attempt,
        nextAttempt: attempt + 1,
        delayMs,
        error: err.message,
      });

      await sleep(delayMs);
    }
  }

  throw lastError;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { withRetry };
