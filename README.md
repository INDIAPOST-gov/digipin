# DIGIPIN API

Node.js and Express API for encoding and decoding India Post DIGIPIN values from latitude and longitude coordinates.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.x-blue.svg)](https://expressjs.com/)

## Overview

DIGIPIN (Digital PIN) is a 10-character alphanumeric geocode developed by the Department of Posts, India. This service exposes a small HTTP API that:

- Encodes latitude and longitude into a canonical DIGIPIN such as `4P3-JK8-52C9`
- Decodes a DIGIPIN back into its center-point coordinates
- Publishes an interactive Swagger UI at `/api-docs`

For more background on the grid system, see [docs/DIGIPIN_Technical_Document.md](docs/DIGIPIN_Technical_Document.md).

## Getting Started

1. Clone the repository.

```bash
git clone https://github.com/INDIAPOST-gov/digipin.git
cd digipin
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file in the project root.

```env
PORT=5000
NODE_ENV=development
```

4. Start the API.

```bash
npm start
```

For local development with automatic restarts:

```bash
npm run dev
```

The API is available at `http://localhost:5000` and Swagger UI is available at `http://localhost:5000/api-docs`.

## API Examples

Encode coordinates:

```http
GET /api/digipin/encode?latitude=12.9716&longitude=77.5946
```

```json
{
  "digipin": "4P3-JK8-52C9"
}
```

Decode a DIGIPIN:

```http
GET /api/digipin/decode?digipin=4P3-JK8-52C9
```

```json
{
  "latitude": "12.971601",
  "longitude": "77.594584"
}
```

The same operations are also available as `POST` endpoints that accept JSON request bodies.

## Validation Behavior

- Latitude and longitude must be numeric values within the DIGIPIN supported bounds.
- DIGIPIN values are accepted with or without hyphens.
- Lowercase DIGIPIN inputs are normalized automatically.
- Invalid inputs return HTTP `400` with a descriptive `error` message.

## Testing

Run the automated test suite with:

```bash
npm test
```

## Contributing

1. Fork the repository.
2. Create a branch for your changes.
3. Run `npm test`.
4. Push the branch to your fork and open a pull request.

## License

This project is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
