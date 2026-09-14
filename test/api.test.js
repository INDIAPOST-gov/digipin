const { after, before, describe, it } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.NODE_ENV = 'test';
const app = require('../src/app');

const README_ENCODE = {
  latitude: 13.11179621,
  longitude: 80.20264269,
  digipin: '4T396F42L7',
};

const README_DECODE = {
  digipin: '4P3JK852C9',
  latitude: '12.971601',
  longitude: '77.594584',
};

let server;
let baseUrl;

async function request(method, path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
}

before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

describe('GET /api/digipin/encode', () => {
  it('returns the official README DIGIPIN', async () => {
    const { status, body } = await request(
      'GET',
      `/api/digipin/encode?latitude=${README_ENCODE.latitude}&longitude=${README_ENCODE.longitude}`
    );
    assert.equal(status, 200);
    assert.deepEqual(body, { digipin: README_ENCODE.digipin });
  });

  it('returns 400 when latitude or longitude is missing', async () => {
    const missing = await request('GET', '/api/digipin/encode');
    assert.equal(missing.status, 400);
    assert.equal(missing.body.error, 'Latitude and longitude must be valid numbers');

    const empty = await request('GET', '/api/digipin/encode?latitude=&longitude=');
    assert.equal(empty.status, 400);
    assert.equal(empty.body.error, 'Latitude and longitude must be valid numbers');
  });
});

describe('GET /api/digipin/decode', () => {
  it('returns the official README cell centre', async () => {
    const { status, body } = await request(
      'GET',
      `/api/digipin/decode?digipin=${README_DECODE.digipin}`
    );
    assert.equal(status, 200);
    assert.deepEqual(body, {
      latitude: README_DECODE.latitude,
      longitude: README_DECODE.longitude,
    });
  });
});

describe('POST /api/digipin/encode', () => {
  it('encodes a JSON body', async () => {
    const { status, body } = await request('POST', '/api/digipin/encode', {
      latitude: README_ENCODE.latitude,
      longitude: README_ENCODE.longitude,
    });
    assert.equal(status, 200);
    assert.deepEqual(body, { digipin: README_ENCODE.digipin });
  });

  it('returns 400 when the body omits coordinates', async () => {
    const { status, body } = await request('POST', '/api/digipin/encode', {});
    assert.equal(status, 400);
    assert.equal(body.error, 'Latitude and longitude must be valid numbers');
  });
});

describe('POST /api/digipin/decode', () => {
  it('decodes a JSON body', async () => {
    const { status, body } = await request('POST', '/api/digipin/decode', {
      digipin: README_DECODE.digipin,
    });
    assert.equal(status, 200);
    assert.deepEqual(body, {
      latitude: README_DECODE.latitude,
      longitude: README_DECODE.longitude,
    });
  });
});
