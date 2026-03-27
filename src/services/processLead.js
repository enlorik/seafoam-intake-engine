'use strict';

const logger = require('../utils/logger');
const { normalizeLead } = require('./normalizeLead');
const { deduplicateLead } = require('./deduplicateLead');
const { enrichLead } = require('./enrichLead');
const { fanoutLead } = require('./fanoutLead');

/**
 * End-to-end lead processing pipeline.
 *
 * Lifecycle:
 *   1. Normalize raw payload into canonical lead shape
 *   2. Check deduplication — return early if duplicate
 *   3. Enrich with scoring and region data
 *   4. Fan out to destinations
 *   5. Return outcome summary
 */
async function processLead(rawPayload) {
  const lead = normalizeLead(rawPayload);

  logger.info({
    event: 'lead_normalized',
    message: 'Lead normalized from raw payload',
    leadId: lead.id,
    email: lead.email,
    source: lead.source,
  });

  const { isDuplicate } = await deduplicateLead(lead);

  if (isDuplicate) {
    logger.info({
      event: 'lead_duplicate',
      message: 'Duplicate lead ignored',
      email: lead.email,
      source: lead.source,
    });
    return { status: 'duplicate_ignored' };
  }

  const enrichedLead = enrichLead(lead);

  logger.info({
    event: 'lead_enriched',
    message: 'Lead enriched',
    leadId: enrichedLead.id,
    email: enrichedLead.email,
    leadScore: enrichedLead.leadScore,
    region: enrichedLead.region,
  });

  const destinations = await fanoutLead(enrichedLead);

  logger.info({
    event: 'lead_processed',
    message: 'Lead processing complete',
    leadId: enrichedLead.id,
    email: enrichedLead.email,
    source: enrichedLead.source,
  });

  return {
    status: 'processed',
    lead: {
      id: enrichedLead.id,
      email: enrichedLead.email,
      source: enrichedLead.source,
    },
    destinations,
  };
}

module.exports = { processLead };
