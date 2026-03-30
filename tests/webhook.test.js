'use strict';

const request = require('supertest');

// Mock Redis-dependent deduplication and all external fanout destinations
// before requiring the app so Jest replaces them at module load time.
jest.mock('../src/services/deduplicateLead');
jest.mock('../src/services/fanoutLead');

const { deduplicateLead } = require('../src/services/deduplicateLead');
const { fanoutLead } = require('../src/services/fanoutLead');

const app = require('../src/app');

const validPayload = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  source: 'contact-form',
};

describe('POST /leads', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/leads').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('details');
  });

  it('returns 400 with specific errors when email is invalid', async () => {
    const res = await request(app)
      .post('/leads')
      .send({ name: 'Jane Doe', email: 'not-an-email', source: 'contact-form' });
    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.stringContaining('email must be a valid email address')])
    );
  });

  it('returns 201 with processed status for a new lead', async () => {
    deduplicateLead.mockResolvedValue({ isDuplicate: false });
    fanoutLead.mockResolvedValue({ slack: { skipped: true }, airtable: { skipped: true } });

    const res = await request(app).post('/leads').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('processed');
    expect(res.body.lead).toMatchObject({
      email: 'jane@example.com',
      source: 'contact-form',
    });
  });

  it('returns 200 with duplicate_ignored for a duplicate lead', async () => {
    deduplicateLead.mockResolvedValue({ isDuplicate: true });

    const res = await request(app).post('/leads').send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'duplicate_ignored' });
    expect(fanoutLead).not.toHaveBeenCalled();
  });
});
