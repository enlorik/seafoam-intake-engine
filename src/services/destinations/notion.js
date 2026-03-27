'use strict';

const env = require('../../config/env');

/**
 * Notion destination — scaffold.
 *
 * TODO: Implement using the Notion API.
 *
 * Recommended approach:
 *   1. Create a Notion integration at https://www.notion.so/my-integrations
 *   2. Share the target database with the integration.
 *   3. Use the Notion API to create a new page in the database per lead.
 *
 * API endpoint: POST https://api.notion.com/v1/pages
 *
 * Required env vars (already in .env.example):
 *   NOTION_API_KEY
 *   NOTION_DATABASE_ID
 *
 * Property mapping suggestion:
 *   Lead ID → title, Name, Email, Source, Intended Product, Region, Lead Score, Submitted At
 *
 * Docs: https://developers.notion.com/reference/post-page
 */
async function sendToNotion(lead) {
  if (!env.enableNotion) {
    return { success: false, skipped: true, reason: 'Notion integration is disabled' };
  }

  // TODO: Replace this placeholder with a real implementation.
  // The lead object is available here with all normalized and enriched fields.
  void lead;

  throw new Error('Notion destination is not yet implemented. Set ENABLE_NOTION=false to suppress this.');
}

module.exports = { sendToNotion };
