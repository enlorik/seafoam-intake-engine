'use strict';

/**
 * Creates a plain error object with a consistent shape.
 * statusCode is used by the error handler middleware to set the HTTP status.
 */
function httpError(statusCode, message, details = null) {
  const err = new Error(message);
  err.statusCode = statusCode;
  if (details) err.details = details;
  return err;
}

module.exports = { httpError };
