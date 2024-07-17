const request = require('supertest');
const {app, startServer} = require('../index');
const mongoose = require('mongoose');

// Executa antes de todos os testes
beforeAll(async () => {
  await startServer();

  console.log("connectou")
});

// Limpa a conexão com o MongoDB após todos os testes
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
});

describe('GET /', () => {
  it('should return Hello, World!', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, world!');
  });
});
