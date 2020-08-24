require('dotenv').config();
const request = require('supertest');
const express = require('express');
const router = require('./../api/index');

describe('GET endpoints', () => {
  const app = express();
  app.use(router);
  const server = app.listen();

  it('/ : should respond with 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
  });

  it('/error : should throw error', async () => {
    const res = await request(app).get('/error');
    expect(res.status).toEqual(500);
    expect(res.text).toContain('Testing error handling on server');
  });

  it('/flow : should update state table', async () => {
    const res = await request(app).get('/flow');
    expect(res.status).toEqual(200);
  });

  afterAll((done) => {
    server.close();
  });
});

describe('POST endpoints', () => {
  it('Sample test', () => {
    request
    expect(true).toBe(true);
  }); 
});
