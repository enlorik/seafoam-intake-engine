'use strict';

const env = require('../../config/env');

/**
 * Google Sheets destination — scaffold.
 *
 * TODO: Implement using the Google Sheets API v4.
 *
 * Recommended approach:
 *   1. Create a Google Cloud service account and share the target sheet with it.
 *   2. Use `googleapis` npm package to authenticate via a service account key.
 *   3. Use `sheets.spreadsheets.values.append` to add a new row per lead.
 *
 * Required env vars (to be added to .env.example when implemented):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY
 *   GOOGLE_SHEETS_SPREADSHEET_ID
 *   GOOGLE_SHEETS_RANGE  (e.g. "Leads!A:H")
 *
 * Column order suggestion: Lead ID, Name, Email, Source, Product, Region, Score, Submitted At
 */
async function sendToGoogleSheets(lead) {
  if (!env.enableGoogleSheets) {
    return { success: false, skipped: true, reason: 'Google Sheets integration is disabled' };
  }

  // TODO: Replace this placeholder with a real implementation.
  // The lead object is available here with all normalized and enriched fields.
  void lead;

  throw new Error('Google Sheets destination is not yet implemented. Set ENABLE_GOOGLE_SHEETS=false to suppress this.');
}

module.exports = { sendToGoogleSheets };
