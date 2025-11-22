import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get user by ID
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const userResult = await sql`
        SELECT id, email, name FROM users WHERE id = ${userId}
      `;

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userResult.rows[0];

      // Get profiles, preferences, watchlist, continue watching
      const [profilesResult, prefsResult, watchlistResult, continueWatchingResult] = await Promise.all([
        sql`SELECT id, name, avatar, is_kids, is_current FROM user_profiles WHERE user_id = ${userId}`,
        sql`SELECT autoplay, theme FROM user_preferences WHERE user_id = ${userId}`,
        sql`SELECT movie_id as id, title, poster_path, type, release_date, rating FROM watchlist WHERE user_id = ${userId}`,
        sql`SELECT movie_id as id, title, poster_path, type, progress, last_watched FROM continue_watching WHERE user_id = ${userId} ORDER BY last_watched DESC`,
      ]);

      const profiles = profilesResult.rows.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isKids: p.is_kids,
      }));

      const preferences = prefsResult.rows[0] || { autoplay: true, theme: 'dark' };
      const watchlist = watchlistResult.rows.map(w => ({
        id: w.id,
        title: w.title,
        poster: w.poster_path,
        type: w.type,
        releaseDate: w.release_date,
        rating: w.rating,
      }));

      const continueWatching = continueWatchingResult.rows.map(cw => ({
        id: cw.id,
        title: cw.title,
        poster: cw.poster_path,
        type: cw.type,
        progress: parseFloat(cw.progress),
        lastWatched: cw.last_watched,
      }));

      const currentProfile = profiles.find(p => p.is_current) || profiles[0];

      res.status(200).json({
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
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    // Update user
    try {
      const { userId, ...updates } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      // Update preferences if provided
      if (updates.preferences) {
        await sql`
          UPDATE user_preferences
          SET autoplay = ${updates.preferences.autoplay},
              theme = ${updates.preferences.theme},
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${userId}
        `;
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

