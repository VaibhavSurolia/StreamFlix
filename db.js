import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Log connection status
pool.on('connect', () => {
  console.log('✅ Connected to Nile database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

export default pool;