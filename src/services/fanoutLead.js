'use strict';

const logger = require('../utils/logger');
const { withRetry } = require('./retry');
const { sendToSlack } = require('./destinations/slack');
const { sendToAirtable } = require('./destinations/airtable');
const { sendToGoogleSheets } = require('./destinations/googleSheets');
const { sendToNotion } = require('./destinations/notion');

const destinations = [
  { name: 'slack', fn: sendToSlack },
  { name: 'airtable', fn: sendToAirtable },
  { name: 'googleSheets', fn: sendToGoogleSheets },
  { name: 'notion', fn: sendToNotion },
];

/**
 * Routes a fully processed lead to all configured destinations sequentially.
 * Partial failures are collected and reported — one failed destination does
 * not abort the remaining ones.
 *
 * Returns a map of { [destinationName]: { success, skipped?, reason?, ...extras } }
 */
async function fanoutLead(lead) {
  const results = {};

  for (const dest of destinations) {
    try {
      const result = await withRetry(() => dest.fn(lead), { context: dest.name });

      results[dest.name] = result;

      if (result.skipped) {
        // Skipped destinations are expected — no log noise needed
      } else {
        logger.info({
          event: 'destination_success',
          message: `Lead delivered to ${dest.name}`,
          destination: dest.name,
          leadId: lead.id,
          email: lead.email,
        });
      }
    } catch (err) {
      results[dest.name] = { success: false, error: err.message };

      logger.error({
        event: 'destination_failed',
        message: `Failed to deliver lead to ${dest.name}`,
        destination: dest.name,
        leadId: lead.id,
        email: lead.email,
        error: err.message,
      });
    }
  }

  return results;
}

module.exports = { fanoutLead };
