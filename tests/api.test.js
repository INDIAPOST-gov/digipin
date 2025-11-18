/**
 * API Integration Tests for DIGIPIN Endpoints
 * Tests all API routes with various inputs
 */

const request = require('supertest');
const app = require('../src/app');

describe('DIGIPIN API Endpoints', () => {
  describe('GET /api/digipin/encode', () => {
    test('should encode valid coordinates via GET', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 12.9716, longitude: 77.5946 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('digipin');
      expect(response.body.digipin).toBe('4P3-JK8-52C9');
    });

    test('should handle string coordinates via GET', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: '12.9716', longitude: '77.5946' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('digipin');
      expect(response.body.digipin).toBe('4P3-JK8-52C9');
    });

    test('should return 400 for missing latitude', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ longitude: 77.5946 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for missing longitude', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 12.9716 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid latitude (too low)', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 1.0, longitude: 77.5946 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid latitude (too high)', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 40.0, longitude: 77.5946 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid longitude (too low)', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 12.9716, longitude: 60.0 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid longitude (too high)', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 12.9716, longitude: 100.0 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for non-numeric latitude', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 'invalid', longitude: 77.5946 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for non-numeric longitude', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 12.9716, longitude: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/digipin/encode', () => {
    test('should encode valid coordinates via POST', async () => {
      const response = await request(app)
        .post('/api/digipin/encode')
        .send({ latitude: 12.9716, longitude: 77.5946 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('digipin');
      expect(response.body.digipin).toBe('4P3-JK8-52C9');
    });

    test('should return 400 for missing latitude in body', async () => {
      const response = await request(app)
        .post('/api/digipin/encode')
        .send({ longitude: 77.5946 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for missing longitude in body', async () => {
      const response = await request(app)
        .post('/api/digipin/encode')
        .send({ latitude: 12.9716 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for empty body', async () => {
      const response = await request(app)
        .post('/api/digipin/encode')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/digipin/decode', () => {
    test('should decode valid DIGIPIN via GET', async () => {
      const response = await request(app)
        .get('/api/digipin/decode')
        .query({ digipin: '4P3-JK8-52C9' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('latitude');
      expect(response.body).toHaveProperty('longitude');
      expect(parseFloat(response.body.latitude)).toBeCloseTo(12.9716, 4);
      expect(parseFloat(response.body.longitude)).toBeCloseTo(77.5946, 4);
    });

    test('should decode DIGIPIN without hyphens via GET', async () => {
      const response = await request(app)
        .get('/api/digipin/decode')
        .query({ digipin: '4P3JK852C9' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('latitude');
      expect(response.body).toHaveProperty('longitude');
    });

    test('should return 400 for missing DIGIPIN', async () => {
      const response = await request(app)
        .get('/api/digipin/decode')
        .query({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid DIGIPIN format', async () => {
      const response = await request(app)
        .get('/api/digipin/decode')
        .query({ digipin: 'INVALID' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for DIGIPIN with invalid characters', async () => {
      const response = await request(app)
        .get('/api/digipin/decode')
        .query({ digipin: '4P3-JK8-52XY' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for empty DIGIPIN', async () => {
      const response = await request(app)
        .get('/api/digipin/decode')
        .query({ digipin: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/digipin/decode', () => {
    test('should decode valid DIGIPIN via POST', async () => {
      const response = await request(app)
        .post('/api/digipin/decode')
        .send({ digipin: '4P3-JK8-52C9' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('latitude');
      expect(response.body).toHaveProperty('longitude');
      expect(parseFloat(response.body.latitude)).toBeCloseTo(12.9716, 4);
      expect(parseFloat(response.body.longitude)).toBeCloseTo(77.5946, 4);
    });

    test('should return 400 for missing DIGIPIN in body', async () => {
      const response = await request(app)
        .post('/api/digipin/decode')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid DIGIPIN in body', async () => {
      const response = await request(app)
        .post('/api/digipin/decode')
        .send({ digipin: 'INVALID' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Round-trip API Tests', () => {
    test('should encode then decode back to similar coordinates', async () => {
      const originalLat = 28.622788;
      const originalLon = 77.213033;

      // Encode
      const encodeResponse = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: originalLat, longitude: originalLon });

      expect(encodeResponse.status).toBe(200);
      const digipin = encodeResponse.body.digipin;

      // Decode
      const decodeResponse = await request(app)
        .get('/api/digipin/decode')
        .query({ digipin });

      expect(decodeResponse.status).toBe(200);
      expect(parseFloat(decodeResponse.body.latitude)).toBeCloseTo(originalLat, 4);
      expect(parseFloat(decodeResponse.body.longitude)).toBeCloseTo(originalLon, 4);
    });

    test('should handle multiple locations correctly', async () => {
      const locations = [
        { lat: 12.9716, lon: 77.5946, name: 'Bangalore' },
        { lat: 28.7041, lon: 77.1025, name: 'Delhi' },
        { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
      ];

      for (const location of locations) {
        const encodeResponse = await request(app)
          .get('/api/digipin/encode')
          .query({ latitude: location.lat, longitude: location.lon });

        expect(encodeResponse.status).toBe(200);

        const decodeResponse = await request(app)
          .get('/api/digipin/decode')
          .query({ digipin: encodeResponse.body.digipin });

        expect(decodeResponse.status).toBe(200);
        expect(parseFloat(decodeResponse.body.latitude)).toBeCloseTo(location.lat, 4);
        expect(parseFloat(decodeResponse.body.longitude)).toBeCloseTo(location.lon, 4);
      }
    });
  });

  describe('Content-Type and Headers', () => {
    test('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 12.9716, longitude: 77.5946 });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });

    test('should handle CORS headers', async () => {
      const response = await request(app)
        .get('/api/digipin/encode')
        .query({ latitude: 12.9716, longitude: 77.5946 });

      expect(response.status).toBe(200);
      // CORS is enabled, so we should see the header
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
