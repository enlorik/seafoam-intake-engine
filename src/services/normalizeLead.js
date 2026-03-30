'use strict';

const crypto = require('crypto');
const { resolveRawName } = require('../utils/validateLead');

/**
 * Transforms a raw inbound payload (which may vary by source) into the
 * canonical internal lead shape used throughout the rest of the pipeline.
 */
function normalizeLead(raw) {
  const name = resolveRawName(raw);
  const email = (raw.email || raw.emailAddress || '').toLowerCase().trim();
  const source = (raw.source || raw.formName || '').toLowerCase().trim();
  const intendedProduct = raw.intendedProduct || raw.product || null;
  const region = raw.region || raw.country || null;
  const submittedAt = raw.submittedAt || raw.created_at || new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name: name ? name.trim() : '',
    email,
    source,
    intendedProduct: intendedProduct ? intendedProduct.trim() : null,
    region: region ? region.trim() : null,
    leadScore: 0,
    submittedAt: normalizeTimestamp(submittedAt),
  };
}

function normalizeTimestamp(value) {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

module.exports = { normalizeLead };
