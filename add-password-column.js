import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

async function migrate() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        console.log('Adding password_hash column...');

        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
        `);

        console.log('✅ Successfully added password_hash column');
        client.release();
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await pool.end();
    }
}

migrate();
