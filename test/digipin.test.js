const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getDigiPin, getLatLngFromDigiPin } = require('../src/digipin');

// Official README / source-comment vectors
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

describe('getDigiPin', () => {
  it('encodes the official README coordinates', () => {
    assert.equal(
      getDigiPin(README_ENCODE.latitude, README_ENCODE.longitude),
      README_ENCODE.digipin
    );
  });

  it('encodes the official README decode example back to the same DIGIPIN', () => {
    assert.equal(
      getDigiPin(Number(README_DECODE.latitude), Number(README_DECODE.longitude)),
      README_DECODE.digipin
    );
  });

  it('rejects non-numeric coordinates instead of crashing', () => {
    assert.throws(() => getDigiPin(undefined, undefined), /valid numbers/);
    assert.throws(() => getDigiPin('', ''), /valid numbers/);
    assert.throws(() => getDigiPin(NaN, 80), /valid numbers/);
  });

  it('rejects coordinates outside the DIGIPIN bounding box', () => {
    assert.throws(() => getDigiPin(1, 80), /Latitude out of range/);
    assert.throws(() => getDigiPin(13, 60), /Longitude out of range/);
  });
});

describe('getLatLngFromDigiPin', () => {
  it('decodes the official README DIGIPIN to its cell centre', () => {
    assert.deepEqual(getLatLngFromDigiPin(README_DECODE.digipin), {
      latitude: README_DECODE.latitude,
      longitude: README_DECODE.longitude,
    });
  });

  it('decodes the official encode example to the cell centre', () => {
    assert.deepEqual(getLatLngFromDigiPin(README_ENCODE.digipin), {
      latitude: '13.111780',
      longitude: '80.202635',
    });
  });

  it('accepts lowercase DIGIPINs', () => {
    assert.deepEqual(
      getLatLngFromDigiPin(README_DECODE.digipin.toLowerCase()),
      getLatLngFromDigiPin(README_DECODE.digipin)
    );
  });

  it('rejects hyphens, spaces, and invalid length', () => {
    assert.throws(() => getLatLngFromDigiPin('4P3-JK8-52C9'), /10-character/);
    assert.throws(() => getLatLngFromDigiPin('4P3 JK852C9'), /10-character/);
    assert.throws(() => getLatLngFromDigiPin('4P3JK852C'), /10-character/);
  });

  it('rejects characters outside the approved set', () => {
    assert.throws(() => getLatLngFromDigiPin('4P3JK852CA'), /approved DIGIPIN characters/);
  });
});

describe('encode/decode round trip', () => {
  it('keeps the original point inside the decoded cell', () => {
    const pin = getDigiPin(README_ENCODE.latitude, README_ENCODE.longitude);
    const centre = getLatLngFromDigiPin(pin);
    assert.ok(Math.abs(Number(centre.latitude) - README_ENCODE.latitude) < 0.001);
    assert.ok(Math.abs(Number(centre.longitude) - README_ENCODE.longitude) < 0.001);
    assert.equal(
      getDigiPin(Number(centre.latitude), Number(centre.longitude)),
      pin
    );
  });
});
