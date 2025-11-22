import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Get user
    const userResult = await sql`
      SELECT id, email, name, password_hash FROM users WHERE email = ${email}
    `;

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get user profiles
    const profilesResult = await sql`
      SELECT id, name, avatar, is_kids, is_current
      FROM user_profiles
      WHERE user_id = ${user.id}
      ORDER BY is_current DESC, created_at ASC
    `;

    const profiles = profilesResult.rows.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isKids: p.is_kids,
    }));

    const currentProfile = profiles.find(p => p.is_current) || profiles[0];

    // Get preferences
    const prefsResult = await sql`
      SELECT autoplay, theme FROM user_preferences WHERE user_id = ${user.id}
    `;

    const preferences = prefsResult.rows[0] || { autoplay: true, theme: 'dark' };

    // Get watchlist
    const watchlistResult = await sql`
      SELECT movie_id as id, title, poster_path, type, release_date, rating
      FROM watchlist
      WHERE user_id = ${user.id}
    `;

    const watchlist = watchlistResult.rows.map(w => ({
      id: w.id,
      title: w.title,
      poster: w.poster_path,
      type: w.type,
      releaseDate: w.release_date,
      rating: w.rating,
    }));

    // Get continue watching
    const continueWatchingResult = await sql`
      SELECT movie_id as id, title, poster_path, type, progress, last_watched
      FROM continue_watching
      WHERE user_id = ${user.id}
      ORDER BY last_watched DESC
    `;

    const continueWatching = continueWatchingResult.rows.map(cw => ({
      id: cw.id,
      title: cw.title,
      poster: cw.poster_path,
      type: cw.type,
      progress: parseFloat(cw.progress),
      lastWatched: cw.last_watched,
    }));

    // Return user data
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      profiles,
      currentProfile: currentProfile?.id || profiles[0]?.id,
      preferences: {
        autoplay: preferences.autoplay,
        theme: preferences.theme,
      },
      watchlist,
      continueWatching,
    };

    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

