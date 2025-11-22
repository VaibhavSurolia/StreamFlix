import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  if (req.method === 'GET') {
    // Get watchlist
    try {
      const result = await sql`
        SELECT movie_id as id, title, poster_path, type, release_date, rating
        FROM watchlist
        WHERE user_id = ${userId}
        ORDER BY added_at DESC
      `;

      const watchlist = result.rows.map(w => ({
        id: w.id,
        title: w.title,
        poster: w.poster_path,
        type: w.type,
        releaseDate: w.release_date,
        rating: w.rating,
      }));

      res.status(200).json(watchlist);
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // Add to watchlist
    try {
      const { movieId, title, poster, type, releaseDate, rating } = req.body;

      await sql`
        INSERT INTO watchlist (user_id, movie_id, title, poster_path, type, release_date, rating)
        VALUES (${userId}, ${movieId}, ${title}, ${poster}, ${type}, ${releaseDate}, ${rating})
        ON CONFLICT (user_id, movie_id, type) DO NOTHING
      `;

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Add to watchlist error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    // Remove from watchlist
    try {
      const { movieId, type } = req.body;

      await sql`
        DELETE FROM watchlist
        WHERE user_id = ${userId} AND movie_id = ${movieId} AND type = ${type}
      `;

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Remove from watchlist error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

