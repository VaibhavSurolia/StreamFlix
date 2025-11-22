import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING id, email, name, created_at
    `;

    const userId = userResult.rows[0].id;

    // Create default profile
    await sql`
      INSERT INTO user_profiles (user_id, name, avatar, is_kids, is_current)
      VALUES (${userId}, ${name.split(' ')[0] || 'Profile 1'}, '👤', FALSE, TRUE)
    `;

    // Create default preferences
    await sql`
      INSERT INTO user_preferences (user_id, autoplay, theme)
      VALUES (${userId}, TRUE, 'dark')
    `;

    // Return user (without password)
    const user = {
      id: userId,
      email: userResult.rows[0].email,
      name: userResult.rows[0].name,
      profiles: [{ id: '1', name: name.split(' ')[0] || 'Profile 1', avatar: '👤', isKids: false }],
      currentProfile: '1',
      preferences: { autoplay: true, theme: 'dark' },
      watchlist: [],
      continueWatching: [],
    };

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

