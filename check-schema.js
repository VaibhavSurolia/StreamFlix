import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

async function checkSchema() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        console.log(JSON.stringify(res.rows, null, 2));
        client.release();
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkSchema();
