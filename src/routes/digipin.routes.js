const express = require('express');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');

function handleEncode(req, res) {
  const payload = req.method === 'GET' ? req.query : req.body;
  const { latitude, longitude } = payload;

  try {
    const code = getDigiPin(latitude, longitude);
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

function handleDecode(req, res) {
  const payload = req.method === 'GET' ? req.query : req.body;
  const { digipin } = payload;

  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

router.get('/encode', handleEncode);
router.post('/encode', handleEncode);
router.get('/decode', handleDecode);
router.post('/decode', handleDecode);

module.exports = router;
