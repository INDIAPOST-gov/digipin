const express = require('express');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');
const { getCoordinatesFromPayload } = require('../utils/coordinatesUtils');
const ENCODE_EXAMPLES = 'coordinates="12.903016468272682,77.60606960542954"\nlatitude="12°54\'\'10.3\"N", longitude="77°36\'\'22.3\"E"';

router.post('/encode', (req, res) => {
  try {
    const { latitude, longitude } = getCoordinatesFromPayload(req.body);
    const code = getDigiPin(latitude, longitude);
    res.json({ digipin: code, input: { latitude, longitude } });
  } catch (e) {
    const msg = e.message || 'Invalid input';
    if (msg.includes('Provide "coordinates"')) {
      return res.status(400).json({ error: msg, examples: ENCODE_EXAMPLES });
    }
    res.status(400).json({ error: msg });
  }
});

router.post('/decode', (req, res) => { const { digipin } = req.body; try { const coords = getLatLngFromDigiPin(digipin); res.json(coords); } catch (e) { res.status(400).json({ error: e.message }); } });

router.get('/encode', (req, res) => {
  try {
    const { latitude, longitude } = getCoordinatesFromPayload(req.query);
    const code = getDigiPin(latitude, longitude);
    res.json({ digipin: code, input: { latitude, longitude } });
  } catch (e) {
    const msg = e.message || 'Invalid input';
    if (msg.includes('Provide "coordinates"')) {
      return res.status(400).json({ error: msg, examples: ENCODE_EXAMPLES });
    }
    res.status(400).json({ error: msg });
  }
});
  
  router.get('/decode', (req, res) => {
    const { digipin } = req.query;
    try {
      const coords = getLatLngFromDigiPin(digipin);
      res.json(coords);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  
module.exports = router;