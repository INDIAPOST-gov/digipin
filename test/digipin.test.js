const assert = require('node:assert/strict');
const { once } = require('node:events');
const http = require('node:http');

process.env.NODE_ENV = 'test';

const app = require('../src/app');
const { getDigiPin, getLatLngFromDigiPin } = require('../src/digipin');

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

let server;
let baseUrl;

test('getDigiPin encodes a known coordinate pair', () => {
  assert.equal(getDigiPin(12.9716, 77.5946), '4P3-JK8-52C9');
});

test('getDigiPin rejects missing latitude values with a clear error', () => {
  assert.throws(() => getDigiPin(undefined, 77.5946), /Latitude is required/);
});

test('getDigiPin rejects non-numeric longitude values with a clear error', () => {
  assert.throws(() => getDigiPin(12.9716, 'east'), /Longitude must be a valid number/);
});

test('getLatLngFromDigiPin accepts lowercase pins and returns the center coordinates', () => {
  assert.deepEqual(getLatLngFromDigiPin('4p3-jk8-52c9'), {
    latitude: '12.971601',
    longitude: '77.594584'
  });
});

test('getLatLngFromDigiPin rejects malformed pins', () => {
  assert.throws(() => getLatLngFromDigiPin('INVALIDPIN'), /Invalid DIGIPIN/);
});

test('POST /api/digipin/encode accepts numeric strings in JSON bodies', async () => {
  const response = await fetch(`${baseUrl}/api/digipin/encode`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      latitude: '12.9716',
      longitude: '77.5946'
    })
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { digipin: '4P3-JK8-52C9' });
});

test('GET /api/digipin/encode returns a validation error for invalid coordinates', async () => {
  const response = await fetch(`${baseUrl}/api/digipin/encode?latitude=abc&longitude=77.5946`);

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Latitude must be a valid number' });
});

test('POST /api/digipin/decode returns a validation error when digipin is missing', async () => {
  const response = await fetch(`${baseUrl}/api/digipin/decode`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({})
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'DIGIPIN is required' });
});

async function startServer() {
  server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
}

async function stopServer() {
  if (!server) {
    return;
  }

  server.close();
  await once(server, 'close');
}

async function run() {
  let passed = 0;

  await startServer();

  try {
    for (const { name, fn } of tests) {
      await fn();
      passed += 1;
      console.log(`ok - ${name}`);
    }
  } catch (error) {
    console.error(`not ok - ${tests[passed].name}`);
    console.error(error);
    process.exitCode = 1;
  } finally {
    await stopServer();
  }

  if (!process.exitCode) {
    console.log(`${passed}/${tests.length} tests passed`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
