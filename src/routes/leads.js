'use strict';

const { Router } = require('express');
const { safeAsync } = require('../utils/safeAsync');
const { validateLead } = require('../utils/validateLead');
const { httpError } = require('../utils/httpError');
const { processLead } = require('../services/processLead');

const router = Router();

/**
 * POST /leads
 *
 * Accepts an inbound lead payload, validates it, and runs it through the
 * full processing pipeline: normalize → deduplicate → enrich → fanout.
 *
 * Body fields (at minimum):
 *   name | fullName | (first_name + last_name)   — required
 *   email | emailAddress                          — required
 *   source | formName                             — required
 *   intendedProduct | product                     — optional
 *   region | country                              — optional
 *   submittedAt | created_at                      — optional (defaults to now)
 */
router.post('/', safeAsync(async (req, res) => {
  const { valid, errors } = validateLead(req.body);

  if (!valid) {
    throw httpError(400, 'Lead validation failed', errors);
  }

  const result = await processLead(req.body);

  if (result.status === 'duplicate_ignored') {
    return res.status(200).json({ status: 'duplicate_ignored' });
  }

  return res.status(201).json(result);
}));

module.exports = router;
