'use strict';

const request = require('supertest');

jest.mock('../src/services/deduplicateLead');
jest.mock('../src/services/fanoutLead');

const { deduplicateLead } = require('../src/services/deduplicateLead');
const { fanoutLead } = require('../src/services/fanoutLead');
const app = require('../src/app');

const VALID_LEAD = {
  name: 'Test User',
  email: 'test@example.com',
  source: 'contact-form',
};

describe('POST /webhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fanoutLead.mockResolvedValue({});
  });

  it('returns HTTP 400 when required fields are missing', async () => {
    const res = await request(app).post('/webhook').send({});
    expect(res.status).toBe(400);
  });

  it('returns HTTP 400 when email is invalid', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ name: 'Test User', email: 'not-an-email', source: 'contact-form' });
    expect(res.status).toBe(400);
  });

  it('returns HTTP 201 with status "processed" for a new lead', async () => {
    deduplicateLead.mockResolvedValue({ isDuplicate: false });

    const res = await request(app).post('/webhook').send(VALID_LEAD);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ status: 'processed' });
  });

  it('returns HTTP 200 with status "duplicate_ignored" for a duplicate lead', async () => {
    deduplicateLead.mockResolvedValue({ isDuplicate: true });

    const res = await request(app).post('/webhook').send(VALID_LEAD);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'duplicate_ignored' });
  });
});
