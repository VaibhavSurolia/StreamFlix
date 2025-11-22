require('dotenv').config();
const pool = require('./db');

console.log('🔍 Testing database connection...\n');

pool.query('SELECT NOW() as time, current_database() as db, version() as version', (err, res) => {
  if (err) {
    console.error('❌ Connection failed!');
    console.error('Error:', err.message);
  } else {
    console.log('✅ Connection successful!\n');
    console.log('📊 Database:', res.rows[0].db);
    console.log('⏰ Server time:', res.rows[0].time);
    console.log('📌 Version:', res.rows[0].version.substring(0, 50) + '...');
  }
  pool.end();
});
