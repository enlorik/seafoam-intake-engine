'use strict';

// Email domains that are considered personal/low-intent
const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'icloud.com', 'aol.com', 'protonmail.com', 'mail.com',
  'live.com', 'msn.com', 'ymail.com',
]);

// Sources that indicate a higher-intent submission (e.g. a dedicated product form)
const HIGH_INTENT_SOURCES = new Set([
  'typeform', 'webflow', 'calendly', 'product-page',
]);

/**
 * Enriches a normalized lead with derived scoring and region data.
 * All logic is deterministic and local — no external calls.
 */
function enrichLead(lead) {
  let score = 0;

  // A dedicated product inquiry signals higher intent
  if (lead.intendedProduct) score += 20;

  // High-intent form source suggests a deliberate submission
  if (HIGH_INTENT_SOURCES.has(lead.source)) score += 15;

  // A business email domain is a stronger buying signal than a personal one
  const emailDomain = lead.email.split('@')[1] || '';
  if (emailDomain && !PERSONAL_EMAIL_DOMAINS.has(emailDomain)) score += 15;

  // Fill in region from country/region hint if it was not already set
  const region = lead.region || inferRegion(lead.source);

  return {
    ...lead,
    leadScore: score,
    region,
  };
}

// Very basic region inference from source naming convention.
// Extend this with a country-to-region lookup as the system grows.
function inferRegion(source) {
  if (!source) return null;
  if (source.includes('eu') || source.includes('europe')) return 'Europe';
  if (source.includes('us') || source.includes('america')) return 'North America';
  return null;
}

module.exports = { enrichLead };
