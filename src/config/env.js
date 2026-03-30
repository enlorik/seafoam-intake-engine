'use strict';

require('dotenv').config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function boolEnv(name, defaultValue = false) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return defaultValue;
  return raw.toLowerCase() === 'true';
}

const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  redisDedupTtlSeconds: parseInt(process.env.REDIS_DEDUP_TTL_SECONDS || '86400', 10),

  enableSlack: boolEnv('ENABLE_SLACK'),
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',

  enableAirtable: boolEnv('ENABLE_AIRTABLE'),
  airtableApiKey: process.env.AIRTABLE_API_KEY || '',
  airtableBaseId: process.env.AIRTABLE_BASE_ID || '',
  airtableTableName: process.env.AIRTABLE_TABLE_NAME || 'Leads',

  enableNotion: boolEnv('ENABLE_NOTION'),
  notionApiKey: process.env.NOTION_API_KEY || '',
  notionDatabaseId: process.env.NOTION_DATABASE_ID || '',

  enableGoogleSheets: boolEnv('ENABLE_GOOGLE_SHEETS'),
  googleSheetsSpreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
  googleSheetsSheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Leads',
  googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
  googleServiceAccountPrivateKey: (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

module.exports = env;
