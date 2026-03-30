'use strict';

/**
 * Wraps an async route or controller function so that unhandled promise
 * rejections are forwarded to Express's next() error handler rather than
 * causing an unhandled rejection crash.
 */
function safeAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { safeAsync };
