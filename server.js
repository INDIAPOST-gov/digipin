require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`DIGIPIN API is running and API docs can be found at http://localhost:${PORT}/api-docs`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
  });
});
