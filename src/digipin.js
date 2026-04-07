/**
 * DIGIPIN Encoder and Decoder Library
 * Developed by India Post, Department of Posts
 * Released under an open-source license for public use
 *
 * This module contains two main functions:
 *  - getDigiPin(lat, lon): Encodes latitude & longitude into a 10-digit alphanumeric DIGIPIN
 *  - getLatLngFromDigiPin(digiPin): Decodes a DIGIPIN back into its central latitude & longitude
 */

const DIGIPIN_GRID = [
  ['F', 'C', '9', '8'],
  ['J', '3', '2', '7'],
  ['K', '4', '5', '6'],
  ['L', 'M', 'P', 'T']
];

const BOUNDS = {
  minLat: 2.5,
  maxLat: 38.5,
  minLon: 63.5,
  maxLon: 99.5
};

const DIGIPIN_ALLOWED_CHARS = /^[23456789CFJKLMPT]{10}$/;

function normalizeCoordinate(value, label) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${label} is required`);
  }

  const numericValue = typeof value === 'string' ? Number(value.trim()) : value;

  if (!Number.isFinite(numericValue)) {
    throw new Error(`${label} must be a valid number`);
  }

  return numericValue;
}

function normalizeDigiPin(value) {
  if (typeof value !== 'string') {
    throw new Error('DIGIPIN is required');
  }

  const normalizedPin = value.trim().toUpperCase().replace(/-/g, '');

  if (!DIGIPIN_ALLOWED_CHARS.test(normalizedPin)) {
    throw new Error('Invalid DIGIPIN');
  }

  return normalizedPin;
}

function getDigiPin(lat, lon) {
  lat = normalizeCoordinate(lat, 'Latitude');
  lon = normalizeCoordinate(lon, 'Longitude');

  if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) {
    throw new Error('Latitude out of range');
  }

  if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) {
    throw new Error('Longitude out of range');
  }

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;
  let digiPin = '';

  for (let level = 1; level <= 10; level++) {
    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    // The grid is traversed top-to-bottom in reverse latitude order.
    let row = 3 - Math.floor((lat - minLat) / latDiv);
    let col = Math.floor((lon - minLon) / lonDiv);

    row = Math.max(0, Math.min(row, 3));
    col = Math.max(0, Math.min(col, 3));

    digiPin += DIGIPIN_GRID[row][col];

    if (level === 3 || level === 6) {
      digiPin += '-';
    }

    maxLat = minLat + latDiv * (4 - row);
    minLat = minLat + latDiv * (3 - row);
    minLon = minLon + lonDiv * col;
    maxLon = minLon + lonDiv;
  }

  return digiPin;
}

function getLatLngFromDigiPin(digiPin) {
  const pin = normalizeDigiPin(digiPin);

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;

  for (let i = 0; i < 10; i++) {
    const char = pin[i];
    let found = false;
    let ri = -1;
    let ci = -1;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (DIGIPIN_GRID[r][c] === char) {
          ri = r;
          ci = c;
          found = true;
          break;
        }
      }

      if (found) {
        break;
      }
    }

    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;
    const lat1 = maxLat - latDiv * (ri + 1);
    const lat2 = maxLat - latDiv * ri;
    const lon1 = minLon + lonDiv * ci;
    const lon2 = minLon + lonDiv * (ci + 1);

    minLat = lat1;
    maxLat = lat2;
    minLon = lon1;
    maxLon = lon2;
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;

  return {
    latitude: centerLat.toFixed(6),
    longitude: centerLon.toFixed(6)
  };
}

if (typeof module !== 'undefined') {
  module.exports = { getDigiPin, getLatLngFromDigiPin };
}
