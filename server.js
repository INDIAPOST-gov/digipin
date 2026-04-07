require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DIGIPIN API is running at http://localhost:${PORT} and docs are available at /api-docs`);
});
