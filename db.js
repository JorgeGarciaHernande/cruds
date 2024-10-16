const { Pool } = require('pg');
require('dotenv').config(); // Cargar las variables de entorno desde .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render requiere SSL para conexiones seguras
  },
});

module.exports = pool;
