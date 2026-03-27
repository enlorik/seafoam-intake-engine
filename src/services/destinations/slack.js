'use strict';

const env = require('../../config/env');

/**
 * Sends a lead summary to a Slack channel via incoming webhook.
 * Requires ENABLE_SLACK=true and a valid SLACK_WEBHOOK_URL.
 */
async function sendToSlack(lead) {
  if (!env.enableSlack) {
    return { success: false, skipped: true, reason: 'Slack integration is disabled' };
  }

  if (!env.slackWebhookUrl) {
    return { success: false, skipped: true, reason: 'SLACK_WEBHOOK_URL is not configured' };
  }

  const payload = {
    text: `🌊 *New Lead — ${lead.source}*`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New lead received via ${lead.source}*`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name*\n${lead.name}` },
          { type: 'mrkdwn', text: `*Email*\n${lead.email}` },
          { type: 'mrkdwn', text: `*Product*\n${lead.intendedProduct || '—'}` },
          { type: 'mrkdwn', text: `*Region*\n${lead.region || '—'}` },
          { type: 'mrkdwn', text: `*Score*\n${lead.leadScore}` },
          { type: 'mrkdwn', text: `*Lead ID*\n${lead.id}` },
        ],
      },
    ],
  };

  const response = await fetch(env.slackWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Slack responded with ${response.status}: ${text}`);
  }

  return { success: true };
}

module.exports = { sendToSlack };
