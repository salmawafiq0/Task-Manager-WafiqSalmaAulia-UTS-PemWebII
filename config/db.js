const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Gagal terhubung ke PostgreSQL:', err.message);
  } else {
    console.log('✅ Berhasil terhubung ke PostgreSQL!');
    release();
  }
});

module.exports = pool;
