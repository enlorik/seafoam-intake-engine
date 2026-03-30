'use strict';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the raw inbound payload before any processing.
 * Returns { valid: true } or { valid: false, errors: string[] }.
 */
function validateLead(body) {
  const errors = [];

  const name = resolveRawName(body);
  if (!name || name.trim() === '') {
    errors.push('name is required (accepted fields: name, fullName, first_name + last_name)');
  }

  const email = body.email || body.emailAddress || '';
  if (!email || email.trim() === '') {
    errors.push('email is required (accepted fields: email, emailAddress)');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('email must be a valid email address');
  }

  const source = body.source || body.formName || '';
  if (!source || source.trim() === '') {
    errors.push('source is required (accepted fields: source, formName)');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
}

// Shared helper so validation and normalization resolve the name consistently
function resolveRawName(body) {
  if (body.name) return body.name;
  if (body.fullName) return body.fullName;
  if (body.first_name || body.last_name) {
    return [body.first_name, body.last_name].filter(Boolean).join(' ');
  }
  return null;
}

module.exports = { validateLead, resolveRawName };
