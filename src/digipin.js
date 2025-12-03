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

// Create lookup map for O(1) character position lookup
const CHAR_LOOKUP = {};
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 4; c++) {
    CHAR_LOOKUP[DIGIPIN_GRID[r][c]] = { row: r, col: c };
  }
}
  
  function getDigiPin(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
      throw new Error('Invalid coordinates: must be numbers');
    }
    if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) {
      throw new Error(`Latitude out of range (${BOUNDS.minLat} to ${BOUNDS.maxLat})`);
    }
    if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) {
      throw new Error(`Longitude out of range (${BOUNDS.minLon} to ${BOUNDS.maxLon})`);
    }
  
    let minLat = BOUNDS.minLat;
    let maxLat = BOUNDS.maxLat;
    let minLon = BOUNDS.minLon;
    let maxLon = BOUNDS.maxLon;
  
    let digiPin = '';
    const GRID_SIZE = 4;
    const MAX_LEVEL = 10;
  
    for (let level = 1; level <= MAX_LEVEL; level++) {
      const latDiv = (maxLat - minLat) / GRID_SIZE;
      const lonDiv = (maxLon - minLon) / GRID_SIZE;
  
      let row = 3 - Math.floor((lat - minLat) / latDiv);
      let col = Math.floor((lon - minLon) / lonDiv);
  
      row = Math.max(0, Math.min(row, 3));
      col = Math.max(0, Math.min(col, 3));
  
      digiPin += DIGIPIN_GRID[row][col];
  
      if (level === 3 || level === 6) digiPin += '-';
  
      maxLat = minLat + latDiv * (GRID_SIZE - row);
      minLat = minLat + latDiv * (3 - row);
  
      minLon = minLon + lonDiv * col;
      maxLon = minLon + lonDiv;
    }
  
    return digiPin;
  }
  
  
  function getLatLngFromDigiPin(digiPin) {
    if (typeof digiPin !== 'string') {
      throw new Error('Invalid DIGIPIN: must be a string');
    }
    
    const pin = digiPin.replace(/-/g, '').toUpperCase();
    const EXPECTED_LENGTH = 10;
    
    if (pin.length !== EXPECTED_LENGTH) {
      throw new Error(`Invalid DIGIPIN: must be ${EXPECTED_LENGTH} characters`);
    }
    
    let minLat = BOUNDS.minLat;
    let maxLat = BOUNDS.maxLat;
    let minLon = BOUNDS.minLon;
    let maxLon = BOUNDS.maxLon;
    const GRID_SIZE = 4;
  
    for (let i = 0; i < EXPECTED_LENGTH; i++) {
      const char = pin[i];
      const pos = CHAR_LOOKUP[char];
  
      if (!pos) {
        throw new Error(`Invalid character '${char}' in DIGIPIN`);
      }
  
      const latDiv = (maxLat - minLat) / GRID_SIZE;
      const lonDiv = (maxLon - minLon) / GRID_SIZE;
  
      minLat = maxLat - latDiv * (pos.row + 1);
      maxLat = maxLat - latDiv * pos.row;
      minLon = minLon + lonDiv * pos.col;
      maxLon = minLon + lonDiv;
    }
  
    return {
      latitude: ((minLat + maxLat) / 2).toFixed(6),
      longitude: ((minLon + maxLon) / 2).toFixed(6)
    };
  }
  
  
  if (typeof module !== 'undefined') module.exports = { getDigiPin, getLatLngFromDigiPin };