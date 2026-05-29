const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const digipinRoutes = require('./routes/digipin.routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');

// const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, '../swagger.yaml'), 'utf8'));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger Docs Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// DIGIPIN API Routes
app.use('/api/digipin', digipinRoutes);

// Privacy Policy Page
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, '../docs/privacy-policy.html'));
});

// Disclaimer page.html
app.get('/disclaimer', (req, res) => {
  res.sendFile(path.join(__dirname, '../docs/disclaimer.html'));
});
app.use('/docs', express.static(path.join(__dirname, '../docs')));

module.exports = app;
