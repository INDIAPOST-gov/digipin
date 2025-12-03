const express = require('express');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');

router.post('/encode', (req, res, next) => {
  const { latitude, longitude } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  
  try {
    const code = getDigiPin(parseFloat(latitude), parseFloat(longitude));
    res.json({ digipin: code });
  } catch (e) {
    next(e);
  }
});

router.post('/decode', (req, res, next) => {
  const { digipin } = req.body;
  
  if (!digipin) {
    return res.status(400).json({ error: 'DIGIPIN is required' });
  }
  
  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    next(e);
  }
});

router.get('/encode', (req, res, next) => {
  const { latitude, longitude } = req.query;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  
  try {
    const code = getDigiPin(parseFloat(latitude), parseFloat(longitude));
    res.json({ digipin: code });
  } catch (e) {
    next(e);
  }
});

router.get('/decode', (req, res, next) => {
  const { digipin } = req.query;
  
  if (!digipin) {
    return res.status(400).json({ error: 'DIGIPIN is required' });
  }
  
  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    next(e);
  }
});

module.exports = router;