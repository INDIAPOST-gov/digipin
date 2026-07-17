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

// Custom middleware: Validate JSON content-type for POST requests
const validateJsonContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type: Content-Type must be application/json',
        code: 'INVALID_CONTENT_TYPE',
        receivedContentType: contentType || 'none',
        expectedContentType: 'application/json'
      });
    }
  }
  next();
};

// Middleware (order matters - validateJsonContentType before express.json())
app.use(validateJsonContentType);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Error handler for JSON parsing errors (specifically for malformed JSON)
app.use((err, req, res, next) => {
  // Check if it's a JSON parsing error from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON payload: ' + err.message,
      code: 'INVALID_JSON_SYNTAX',
      details: 'Ensure your JSON is properly formatted with correct syntax'
    });
  }
  next(err);
});

// Swagger Docs Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// DIGIPIN API Routes
app.use('/api/digipin', digipinRoutes);

module.exports = app;
