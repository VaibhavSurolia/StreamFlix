require('dotenv').config();

console.log('=== Environment Check ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL value:', process.env.DATABASE_URL ? 'Found (hidden for security)' : 'NOT FOUND!');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('\n');

// Check if pg module is installed
try {
  const { Pool } = require('pg');
  console.log('✅ pg module is installed\n');
  
  console.log('=== Testing Connection ===');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000, // 10 seconds timeout
  });

  pool.query('SELECT NOW() as time, current_database() as db', (err, res) => {
    if (err) {
      console.error('❌ Connection FAILED!\n');
      console.error('Error Code:', err.code);
      console.error('Error Message:', err.message);
      console.error('\nFull Error:', err);
    } else {
      console.log('✅ Connection SUCCESSFUL!\n');
      console.log('Database:', res.rows[0].db);
      console.log('Time:', res.rows[0].time);
    }
    pool.end();
  });

} catch (error) {
  console.error('❌ Error loading pg module:', error.message);
  console.log('\nRun: npm install pg');
}