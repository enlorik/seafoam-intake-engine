'use strict';

const { google } = require('googleapis');
const env = require('../../config/env');

/**
 * Appends one row per processed lead to a Google Sheet.
 *
 * Columns (A–E): Name, Email, Source, Submitted At, Lead Score
 *
 * Requires:
 *   ENABLE_GOOGLE_SHEETS=true
 *   GOOGLE_SHEETS_SPREADSHEET_ID
 *   GOOGLE_SHEETS_SHEET_NAME        (default: "Leads")
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 */
async function sendToGoogleSheets(lead) {
  if (!env.enableGoogleSheets) {
    return { success: false, skipped: true, reason: 'Google Sheets integration is disabled' };
  }

  if (!env.googleSheetsSpreadsheetId || !env.googleServiceAccountEmail || !env.googleServiceAccountPrivateKey) {
    return { success: false, skipped: true, reason: 'Google Sheets credentials are not configured' };
  }

  const auth = new google.auth.JWT({
    email: env.googleServiceAccountEmail,
    key: env.googleServiceAccountPrivateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const range = `${env.googleSheetsSheetName}!A:E`;

  const row = [
    lead.name,
    lead.email,
    lead.source,
    lead.submittedAt,
    lead.leadScore,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: env.googleSheetsSpreadsheetId,
    range,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  });

  return { success: true };
}

module.exports = { sendToGoogleSheets };
