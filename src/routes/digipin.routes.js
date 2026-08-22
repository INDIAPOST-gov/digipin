const express = require('express');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');

router.post('/encode', (req, res) => { const { latitude, longitude } = req.body; if (latitude === undefined || longitude === undefined) { return res.status(400).json({ error: 'Latitude and Longitude are required' }); } try { const code = getDigiPin(latitude, longitude); res.json({ digipin: code }); } catch (e) { res.status(400).json({ error: e.message }); } });

router.post('/decode', (req, res) => { const { digipin } = req.body; try { const coords = getLatLngFromDigiPin(digipin); res.json(coords); } catch (e) { res.status(400).json({ error: e.message }); } });

  router.get('/encode', (req, res) => {
    const { latitude, longitude } = req.query;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }
    try {
      const code = getDigiPin(parseFloat(latitude), parseFloat(longitude));
      res.json({ digipin: code });
    } catch (e) {
      res.status(400).json({ error: e.message });
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