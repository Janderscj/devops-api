import request from 'supertest';
import app from '#src/app.js';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'Healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });
  describe('GET /api', () => {
    it('should return API message', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'API is running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'Not Found');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
