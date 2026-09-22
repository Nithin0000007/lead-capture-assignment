import request from 'supertest';
import express from 'express';
import leadRoutes from '../routes/leadRoutes';
import webhookRoutes from '../routes/webhookRoutes';
import { connectDB } from '../config/db';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/api/leads', leadRoutes);
app.use('/api/webhook', webhookRoutes);

beforeAll(async () => {
  // Using a test database URI
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/test-db';
  await connectDB();
}, 30000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Webhook API', () => {
  it('should create a lead via webhook', async () => {
    const res = await request(app)
      .post('/api/webhook/meta-lead')
      .send({
        name: 'test user',
        email: 'test@example.com',
        phone: '1234567890'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.name).toEqual('Test User'); // Should be Title Cased
  });
});
