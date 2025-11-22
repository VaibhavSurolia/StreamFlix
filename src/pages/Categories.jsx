import { useState, useEffect } from 'react';
import { getGenres, getMoviesByGenre } from '../utils/api';
import Carousel from '../components/Carousel';
import './Categories.css';

const Categories = () => {
  const [genres, setGenres] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          getGenres('movie'),
          getGenres('tv'),
        ]);

        const allGenres = [
          ...movieGenres.map(g => ({ ...g, type: 'movie' })),
          ...tvGenres.map(g => ({ ...g, type: 'tv' })),
        ];

        setGenres(allGenres);

        // Fetch movies for each genre
        const moviesPromises = allGenres.map(async (genre) => {
          const movies = await getMoviesByGenre(genre.id, genre.type);
          return { genreId: genre.id, movies };
        });

        const results = await Promise.all(moviesPromises);
        const moviesMap = {};
        results.forEach(({ genreId, movies }) => {
          moviesMap[genreId] = movies;
        });

        setGenreMovies(moviesMap);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Browse by Category</h1>
        <p>Discover movies and TV shows by genre</p>
      </div>

      <div className="categories-content">
        {genres.map((genre) => (
          genreMovies[genre.id] && genreMovies[genre.id].length > 0 && (
            <Carousel
              key={`${genre.type}-${genre.id}`}
              title={genre.name}
              movies={genreMovies[genre.id]}
              type={genre.type}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Categories;

