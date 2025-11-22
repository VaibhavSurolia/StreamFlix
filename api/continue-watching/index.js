import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  if (req.method === 'POST') {
    // Add/Update continue watching
    try {
      const { movieId, title, poster, type, progress } = req.body;

      await sql`
        INSERT INTO continue_watching (user_id, movie_id, title, poster_path, type, progress)
        VALUES (${userId}, ${movieId}, ${title}, ${poster}, ${type}, ${progress})
        ON CONFLICT (user_id, movie_id, type)
        DO UPDATE SET
          progress = ${progress},
          last_watched = CURRENT_TIMESTAMP
      `;

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update continue watching error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

