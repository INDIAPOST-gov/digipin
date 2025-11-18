/**
 * Input Validation Middleware using express-validator
 * Provides validation rules for DIGIPIN API endpoints
 */

const { body, query, validationResult } = require('express-validator');

// Bounds for valid coordinates in India
const BOUNDS = {
  minLat: 2.5,
  maxLat: 38.5,
  minLon: 63.5,
  maxLon: 99.5
};

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ error: errorMessages });
  }
  next();
};

/**
 * Validation rules for encoding coordinates (GET request)
 */
const validateEncodeGet = [
  query('latitude')
    .exists().withMessage('Latitude is required')
    .notEmpty().withMessage('Latitude cannot be empty')
    .isFloat().withMessage('Latitude must be a valid number')
    .custom((value) => {
      const lat = parseFloat(value);
      if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) {
        throw new Error(`Latitude must be between ${BOUNDS.minLat} and ${BOUNDS.maxLat}`);
      }
      return true;
    }),
  query('longitude')
    .exists().withMessage('Longitude is required')
    .notEmpty().withMessage('Longitude cannot be empty')
    .isFloat().withMessage('Longitude must be a valid number')
    .custom((value) => {
      const lon = parseFloat(value);
      if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) {
        throw new Error(`Longitude must be between ${BOUNDS.minLon} and ${BOUNDS.maxLon}`);
      }
      return true;
    }),
  handleValidationErrors
];

/**
 * Validation rules for encoding coordinates (POST request)
 */
const validateEncodePost = [
  body('latitude')
    .exists().withMessage('Latitude is required')
    .notEmpty().withMessage('Latitude cannot be empty')
    .isFloat().withMessage('Latitude must be a valid number')
    .custom((value) => {
      const lat = parseFloat(value);
      if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) {
        throw new Error(`Latitude must be between ${BOUNDS.minLat} and ${BOUNDS.maxLat}`);
      }
      return true;
    }),
  body('longitude')
    .exists().withMessage('Longitude is required')
    .notEmpty().withMessage('Longitude cannot be empty')
    .isFloat().withMessage('Longitude must be a valid number')
    .custom((value) => {
      const lon = parseFloat(value);
      if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) {
        throw new Error(`Longitude must be between ${BOUNDS.minLon} and ${BOUNDS.maxLon}`);
      }
      return true;
    }),
  handleValidationErrors
];

/**
 * Validation rules for decoding DIGIPIN (GET request)
 */
const validateDecodeGet = [
  query('digipin')
    .exists().withMessage('DIGIPIN is required')
    .notEmpty().withMessage('DIGIPIN cannot be empty')
    .isString().withMessage('DIGIPIN must be a string')
    .trim()
    .custom((value) => {
      // Remove hyphens for validation
      const cleanPin = value.replace(/-/g, '');

      // Check length
      if (cleanPin.length !== 10) {
        throw new Error('DIGIPIN must be 10 characters long (excluding hyphens)');
      }

      // Check valid characters (only these 16 characters are allowed)
      const validChars = /^[2-9CFJKLMPT]+$/;
      if (!validChars.test(cleanPin)) {
        throw new Error('DIGIPIN contains invalid characters. Only 2-9, C, F, J, K, L, M, P, T are allowed');
      }

      return true;
    }),
  handleValidationErrors
];

/**
 * Validation rules for decoding DIGIPIN (POST request)
 */
const validateDecodePost = [
  body('digipin')
    .exists().withMessage('DIGIPIN is required')
    .notEmpty().withMessage('DIGIPIN cannot be empty')
    .isString().withMessage('DIGIPIN must be a string')
    .trim()
    .custom((value) => {
      // Remove hyphens for validation
      const cleanPin = value.replace(/-/g, '');

      // Check length
      if (cleanPin.length !== 10) {
        throw new Error('DIGIPIN must be 10 characters long (excluding hyphens)');
      }

      // Check valid characters (only these 16 characters are allowed)
      const validChars = /^[2-9CFJKLMPT]+$/;
      if (!validChars.test(cleanPin)) {
        throw new Error('DIGIPIN contains invalid characters. Only 2-9, C, F, J, K, L, M, P, T are allowed');
      }

      return true;
    }),
  handleValidationErrors
];

module.exports = {
  validateEncodeGet,
  validateEncodePost,
  validateDecodeGet,
  validateDecodePost
};
