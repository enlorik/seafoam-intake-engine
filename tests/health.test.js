'use strict';

const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('returns HTTP 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('returns JSON with status "ok"', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toMatchObject({ status: 'ok' });
  });
});
