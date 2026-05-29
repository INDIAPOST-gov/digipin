/**
 * DIGIPIN Encoder and Decoder Library
 * Developed by India Post, Department of Posts
 * Released under an open-source license for public use
 *
 * This module contains two main functions:
 *  - getDigiPin(lat, lon): Encodes latitude & longitude into a 10-digit alphanumeric DIGIPIN
 *  - getLatLngFromDigiPin(digiPin): Decodes a DIGIPIN back into its central latitude & longitude
 */

/**
 * Module: DIGIPIN Encoder/Decoder
 * Author: CEPT
 * Date : 28.04.20026
 * Description:
 * Provides utility functions to convert geographic coordinates
 * to a standardized DIGIPIN and vice versa.
 *
 * Functions:
 * 1. getDigiPin(lat, lon)
 *    - Converts latitude and longitude into a continuous
 *      10-character alphanumeric DIGIPIN.
 *    - Output is a single, uninterrupted string (no spaces or separators).
 *    - In adherence to Standard address format .
 *
 * 2. getLatLngFromDigiPin(digiPin)
 *    - Converts a valid 10-character DIGIPIN back to the
 *      corresponding central latitude and longitude.
 *
 * Notes:
 * - DIGIPIN is case-insensitive but is normalized to uppercase.
 * - Input validation is enforced for coordinate bounds and DIGIPIN format.
 */

// Allowed DIGIPIN characters

const DIGIPIN_GRID = [
  ["F", "C", "9", "8"],
  ["J", "3", "2", "7"],
  ["K", "4", "5", "6"],
  ["L", "M", "P", "T"],
];

const BOUNDS = {
  minLat: 2.5,
  maxLat: 38.5,
  minLon: 63.5,
  maxLon: 99.5,
};

/**
 * Function Name: getDigiPin
 * Arguments    : Latitude, Longitude (e.g., 13.11179621, 80.20264269)
 * Updated By   : CEPT
 * Updated Date : 2026-05-04
 * Description  : Encodes latitude and longitude into a continuous
 *                10-character alphanumeric DIGIPIN (single string, no separators, allowed characters).
 * Output       : Example → 4T396F42L7
 * Modifications : The DIGIPIN format would remain as 10-character continuous string w/o any punctuations.
 */
function getDigiPin(lat, lon) {

  if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat)
    throw new Error("Latitude out of range");
  if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon)
    throw new Error("Longitude out of range");

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;

  let digiPin = "";

  for (let level = 1; level <= 10; level++) {
    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    // REVERSED row logic (to match original)
    let row = 3 - Math.floor((lat - minLat) / latDiv);
    let col = Math.floor((lon - minLon) / lonDiv);

    row = Math.max(0, Math.min(row, 3));
    col = Math.max(0, Math.min(col, 3));

    digiPin += DIGIPIN_GRID[row][col];

    if (level === 3 || level === 6) digiPin += "";

    // Update bounds (reverse logic for row)
    maxLat = minLat + latDiv * (4 - row);
    minLat = minLat + latDiv * (3 - row);

    minLon = minLon + lonDiv * col;
    maxLon = minLon + lonDiv;
  }

  const str = String(digiPin).toUpperCase();
  return digiPin;
}

/**
 * Name         : getLatLngFromDigiPin
 * Arguments    : DIGIPIN (e.g., 4T396F42L7)
 * Updated By   : CEPT
 * Updated Date : 2026-05-04
 * Description  : Decodes a 10-character DIGIPIN (continuous string, no separators)
 *                into its corresponding central latitude and longitude.
 * Output       : { latitude: "xx.xxxxxx", longitude: "yy.yyyyyy" }
 *  * Validation   :
 *  - Must be a string
 *  - Must be exactly 10 characters
 *  - Must contain only approved DIGIPIN characters
 *  - No spaces, hyphens, or special characters permitted
 */
function getLatLngFromDigiPin(digiPin) {

  // Validate input type
  if (typeof digiPin !== "string") {
    throw new Error(
      "Invalid DIGIPIN. DIGIPIN must be provided as a string."
    );
  }

  const pin = digiPin.trim().toUpperCase();

  // Length validation
  if (pin.length !== 10) {
    throw new Error(
      "Invalid DIGIPIN. DIGIPIN must be a continuous 10-character string."
    );
  }

  // Validate approved DIGIPIN character set
  if (!/^[23456789CJKLMPFT]{10}$/.test(pin)) {
    throw new Error(
      "Invalid DIGIPIN. Only approved DIGIPIN characters (2,3,4,5,6,7,8,9,C,J,K,L,M,P,F,T) are permitted. Spaces, hyphens, and special characters are not allowed."
    );
  }
  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;

  for (let i = 0; i < 10; i++) {
    const char = pin[i];
    let found = false;
    let ri = -1,
      ci = -1;

    // Locate character in DIGIPIN grid
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (DIGIPIN_GRID[r][c] === char) {
          ri = r;
          ci = c;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) throw new Error("Invalid character in DIGIPIN");

    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    const lat1 = maxLat - latDiv * (ri + 1);
    const lat2 = maxLat - latDiv * ri;
    const lon1 = minLon + lonDiv * ci;
    const lon2 = minLon + lonDiv * (ci + 1);

    // Update bounding box for next level
    minLat = lat1;
    maxLat = lat2;
    minLon = lon1;
    maxLon = lon2;
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;

  return {
    latitude: centerLat.toFixed(6),
    longitude: centerLon.toFixed(6),  

  };
}

if (typeof module !== "undefined")
  module.exports = { getDigiPin, getLatLngFromDigiPin };
