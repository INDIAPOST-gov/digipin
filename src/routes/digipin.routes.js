const express = require('express');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');
const {
  validateEncodeGet,
  validateEncodePost,
  validateDecodeGet,
  validateDecodePost
} = require('../middleware/validation');

/**
 * @route   GET /api/digipin/encode
 * @desc    Encode latitude and longitude to DIGIPIN
 * @access  Public
 */
router.get('/encode', validateEncodeGet, (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const code = getDigiPin(parseFloat(latitude), parseFloat(longitude));
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   POST /api/digipin/encode
 * @desc    Encode latitude and longitude to DIGIPIN
 * @access  Public
 */
router.post('/encode', validateEncodePost, (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const code = getDigiPin(latitude, longitude);
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   GET /api/digipin/decode
 * @desc    Decode DIGIPIN to latitude and longitude
 * @access  Public
 */
router.get('/decode', validateDecodeGet, (req, res) => {
  const { digipin } = req.query;
  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   POST /api/digipin/decode
 * @desc    Decode DIGIPIN to latitude and longitude
 * @access  Public
 */
router.post('/decode', validateDecodePost, (req, res) => {
  const { digipin } = req.body;
  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;