const express = require('express');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');

/**
 * Validation helper: Check if value is a valid number
 * @param {*} value - Value to validate
 * @returns {boolean} - True if value is a valid number
 */
function isValidNumber(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return typeof num === 'number' && !isNaN(num) && isFinite(num);
}

/**
 * Validation helper: Check if value is a non-empty string
 * @param {*} value - Value to validate
 * @returns {boolean} - True if value is a non-empty string
 */
function isValidString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * POST /encode - Encode latitude and longitude into DIGIPIN
 * @body {number} latitude - Latitude coordinate
 * @body {number} longitude - Longitude coordinate
 * @returns {object} {digipin: string} - Encoded DIGIPIN code
 */
router.post('/encode', (req, res) => {
  const { latitude, longitude } = req.body;

  // Validate inputs
  if (latitude === undefined || latitude === null) {
    return res.status(400).json({
      error: 'Missing required field: latitude',
      code: 'MISSING_LATITUDE'
    });
  }

  if (longitude === undefined || longitude === null) {
    return res.status(400).json({
      error: 'Missing required field: longitude',
      code: 'MISSING_LONGITUDE'
    });
  }

  if (!isValidNumber(latitude)) {
    return res.status(400).json({
      error: 'Invalid latitude: must be a valid number',
      code: 'INVALID_LATITUDE'
    });
  }

  if (!isValidNumber(longitude)) {
    return res.status(400).json({
      error: 'Invalid longitude: must be a valid number',
      code: 'INVALID_LONGITUDE'
    });
  }

  try {
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    const code = getDigiPin(latNum, lonNum);
    res.status(200).json({ digipin: code });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      code: 'ENCODING_FAILED'
    });
  }
});

/**
 * POST /decode - Decode DIGIPIN to coordinates
 * @body {string} digipin - DIGIPIN code to decode
 * @returns {object} {latitude: string, longitude: string} - Decoded coordinates
 */
router.post('/decode', (req, res) => {
  const { digipin } = req.body;

  // Validate input
  if (digipin === undefined || digipin === null) {
    return res.status(400).json({
      error: 'Missing required field: digipin',
      code: 'MISSING_DIGIPIN'
    });
  }

  // Validate digipin is a string type
  if (typeof digipin !== 'string') {
    return res.status(400).json({
      error: `Invalid digipin type: expected string, received ${typeof digipin}`,
      code: 'INVALID_DIGIPIN_TYPE',
      receivedType: typeof digipin
    });
  }

  if (!isValidString(digipin)) {
    return res.status(400).json({
      error: 'Invalid digipin: must be a non-empty string',
      code: 'INVALID_DIGIPIN'
    });
  }

  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.status(200).json(coords);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      code: 'DECODING_FAILED'
    });
  }
});

/**
 * GET /encode - Encode latitude and longitude into DIGIPIN
 * @query {number} latitude - Latitude coordinate
 * @query {number} longitude - Longitude coordinate
 * @returns {object} {digipin: string} - Encoded DIGIPIN code
 */
router.get('/encode', (req, res) => {
  const { latitude, longitude } = req.query;

  // Validate inputs
  if (!latitude || !longitude) {
    return res.status(400).json({
      error: 'Missing required query parameters: latitude and longitude',
      code: 'MISSING_PARAMETERS'
    });
  }

  if (!isValidNumber(latitude)) {
    return res.status(400).json({
      error: 'Invalid latitude: must be a valid number',
      code: 'INVALID_LATITUDE'
    });
  }

  if (!isValidNumber(longitude)) {
    return res.status(400).json({
      error: 'Invalid longitude: must be a valid number',
      code: 'INVALID_LONGITUDE'
    });
  }

  try {
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    const code = getDigiPin(latNum, lonNum);
    res.status(200).json({ digipin: code });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      code: 'ENCODING_FAILED'
    });
  }
});

/**
 * GET /decode - Decode DIGIPIN to coordinates
 * @query {string} digipin - DIGIPIN code to decode
 * @returns {object} {latitude: string, longitude: string} - Decoded coordinates
 */
router.get('/decode', (req, res) => {
  const { digipin } = req.query;

  // Validate input
  if (!digipin) {
    return res.status(400).json({
      error: 'Missing required query parameter: digipin',
      code: 'MISSING_DIGIPIN'
    });
  }

  // Validate digipin is a string type (query params are always strings, but for safety)
  if (typeof digipin !== 'string') {
    return res.status(400).json({
      error: `Invalid digipin type: expected string, received ${typeof digipin}`,
      code: 'INVALID_DIGIPIN_TYPE',
      receivedType: typeof digipin
    });
  }

  if (!isValidString(digipin)) {
    return res.status(400).json({
      error: 'Invalid digipin: must be a non-empty string',
      code: 'INVALID_DIGIPIN'
    });
  }

  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.status(200).json(coords);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      code: 'DECODING_FAILED'
    });
  }
});

module.exports = router;