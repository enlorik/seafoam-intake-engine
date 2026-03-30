'use strict';

const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    logger.error({
      event: 'unhandled_error',
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  const body = {
    error: isServerError ? 'Internal server error' : err.message,
  };

  if (err.details) {
    body.details = err.details;
  }

  res.status(statusCode).json(body);
}

module.exports = { errorHandler };
