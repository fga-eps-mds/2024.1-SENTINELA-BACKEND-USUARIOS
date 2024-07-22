const request = require('supertest');
const mongoose = require('mongoose');
const { app, startServer } = require('../index'); // Ajuste conforme necessário

let server;

beforeAll(async () => {
  server = await startServer(); // Inicia o servidor
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('UserController', () => {
  
  let authToken;
  let userId;

  it('should sign up a user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '4002-8922',
        password: 'pass'
      });
    
    expect(response.status).toBe(201);
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@admin.com',
        password: 'senha'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    authToken = response.body.token;
    userId = response.body.user._id;
  });

  it('should get all users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a user by ID', async () => {
    const response = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'admin@admin.com');
  });

  it('should update a user', async () => {
    const response = await request(app)
      .patch(`/users/patch/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'John Smith' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'John Smith');
  });

  it('should delete a user', async () => {
    const response = await request(app)
      .delete(`/users/delete/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'admin@admin.com');
  });

  it('should recover a user password', async () => {
    const response = await request(app)
      .post('/users/recover-password')
      .send({
        email: 'john.doe@example.com'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensagem', 'Email enviado com instruções para redefinir sua senha.');
  });

});
