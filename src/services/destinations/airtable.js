'use strict';

const env = require('../../config/env');

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

/**
 * Creates a new record in an Airtable base.
 * Requires ENABLE_AIRTABLE=true and valid AIRTABLE_API_KEY, AIRTABLE_BASE_ID,
 * and AIRTABLE_TABLE_NAME environment variables.
 */
async function sendToAirtable(lead) {
  if (!env.enableAirtable) {
    return { success: false, skipped: true, reason: 'Airtable integration is disabled' };
  }

  if (!env.airtableApiKey || !env.airtableBaseId) {
    return { success: false, skipped: true, reason: 'Airtable credentials are not configured' };
  }

  const url = `${AIRTABLE_API_BASE}/${env.airtableBaseId}/${encodeURIComponent(env.airtableTableName)}`;

  const record = {
    fields: {
      'Lead ID': lead.id,
      'Name': lead.name,
      'Email': lead.email,
      'Source': lead.source,
      'Intended Product': lead.intendedProduct || '',
      'Region': lead.region || '',
      'Lead Score': lead.leadScore,
      'Submitted At': lead.submittedAt,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.airtableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Airtable responded with ${response.status}: ${body}`);
  }

  const data = await response.json();

  return { success: true, recordId: data.id };
}

module.exports = { sendToAirtable };
