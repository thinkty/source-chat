require('dotenv').config();
const request = require('supertest');
const express = require('express');
const router = require('../api/index');
const sampleGraph = require('./sample.json');

describe('GET endpoints', () => {
  const app = express();
  app.use(router);
  const server = app.listen();

  it('/ : should respond with 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
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
  const app = express();
  app.use(router);
  const server = app.listen();

  it('/flow : should update Dialogflow and the state table', async () => {
    const res = await request(app)
      .post('/flow')
      .send({ agent: 'testing agent', graph: sampleGraph });

    expect(res.status).toEqual(200);
  });

  afterAll((done) => {
    server.close();
  });
});
