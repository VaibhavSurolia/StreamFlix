import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

async function testSignup() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    try {
        const client = await pool.connect();
        console.log(`Attempting to register user: ${email}`);

        const password_hash = await bcrypt.hash(password, 10);

        const result = await client.query(
            `INSERT INTO users (email, password_hash, name, created_at, updated_at) 
             VALUES ($1, $2, $3, NOW(), NOW()) 
             RETURNING id, email, name`,
            [email, password_hash, name]
        );

        console.log('✅ User registered successfully:', result.rows[0]);

        // Verify login
        const loginResult = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = loginResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (validPassword) {
            console.log('✅ Password verification successful');
        } else {
            console.error('❌ Password verification failed');
        }

        client.release();
    } catch (err) {
        console.error('❌ Signup failed:', err.message);
    } finally {
        await pool.end();
    }
}

testSignup();
