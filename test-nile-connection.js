import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

async function testConnection() {
    console.log('Testing connection to Nile database...');

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not defined in .env file');
        process.exit(1);
    }

    const dbUrl = process.env.DATABASE_URL;
    console.log(`Debug: Connection string starts with: ${dbUrl.substring(0, 15)}...`);
    console.log(`Debug: Connection string length: ${dbUrl.length}`);

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const client = await pool.connect();
        console.log('✅ Successfully connected to database');

        // Check if users table exists
        const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

        if (res.rows[0].exists) {
            console.log('✅ Users table exists');

            // Check columns
            const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users';
      `);

            console.log('Table columns:', columns.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));
        } else {
            console.log('❌ Users table does NOT exist');
        }

        client.release();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
