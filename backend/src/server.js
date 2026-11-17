require('dotenv').config();

const app = require('./app')();
const db = require('./config/db');

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`Job Board API listening on port ${port}`);
});

function shutdown() {
  server.close(async () => {
    await db.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
