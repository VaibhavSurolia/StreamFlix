import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getMovieVideos, getPopular } from '../utils/api';
import { getPosterUrl, getBackdropUrl } from '../utils/api';
import { authService } from '../utils/auth';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';
import './MovieDetails.css';

const MovieDetails = ({ type = 'movie' }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, creditsData, videosData] = await Promise.all([
          getMovieDetails(id, type),
          getMovieCredits(id, type),
          getMovieVideos(id, type),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData);

        // Fetch similar content
        const similarData = await getPopular(type);
        setSimilar(similarData.filter(item => item.id !== parseInt(id)).slice(0, 10));

        setIsInWatchlist(authService.isInWatchlist(parseInt(id), type));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  const handleWatchlistToggle = () => {
    if (!user) return;

    if (isInWatchlist) {
      authService.removeFromWatchlist(parseInt(id), type);
      setIsInWatchlist(false);
    } else {
      authService.addToWatchlist({
        id: parseInt(id),
        title: movie.title || movie.name,
        poster: movie.poster_path,
        type,
        releaseDate: movie.release_date || movie.first_air_date,
        rating: movie.vote_average,
      });
      setIsInWatchlist(true);
    }
  };

  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-message">
        <h2>Movie not found</h2>
      </div>
    );
  }

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const duration = movie.runtime || movie.episode_run_time?.[0] || 0;
  const genres = movie.genres || [];

  return (
    <div className="movie-details-page">
      <div
        className="details-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), var(--bg-dark)), url(${getBackdropUrl(movie.backdrop_path)})`,
        }}
      >
        <div className="details-hero-content">
          <div className="details-poster">
            <img src={getPosterUrl(movie.poster_path)} alt={title} />
          </div>

          <div className="details-info">
            <h1>{title}</h1>

            <div className="details-meta">
              <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
              {year && <span>{year}</span>}
              {duration > 0 && <span>{Math.floor(duration / 60)}h {duration % 60}m</span>}
              {movie.number_of_seasons && <span>{movie.number_of_seasons} Seasons</span>}
              {movie.number_of_episodes && <span>{movie.number_of_episodes} Episodes</span>}
            </div>

            <div className="details-genres">
              {genres.map(genre => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>

            <p className="details-overview">{movie.overview}</p>

            <div className="details-actions">
              <Link
                to={`/watch/${type}/${id}`}
                className="details-btn details-btn-primary"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </Link>

              {trailer && (
                <button
                  className="details-btn details-btn-secondary"
                  onClick={() => setShowTrailer(true)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 7l-7 5 7 5V7z"></path>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  Trailer
                </button>
              )}

              {user && (
                <button
                  className={`details-btn details-btn-icon ${isInWatchlist ? 'active' : ''}`}
                  onClick={handleWatchlistToggle}
                >
                  {isInWatchlist ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12v7H5v-7M12 3v9m-4-4l4 4 4-4" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {credits && credits.cast && credits.cast.length > 0 && (
              <div className="details-cast">
                <h3>Cast</h3>
                <div className="cast-list">
                  {credits.cast.slice(0, 10).map(actor => (
                    <div key={actor.id} className="cast-item">
                      <div className="cast-avatar">
                        {actor.profile_path ? (
                          <img src={getPosterUrl(actor.profile_path, 'w185')} alt={actor.name} />
                        ) : (
                          <div className="cast-placeholder">{actor.name.charAt(0)}</div>
                        )}
                      </div>
                      <p className="cast-name">{actor.name}</p>
                      <p className="cast-character">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="similar-section">
          <h2>More Like This</h2>
          <div className="similar-grid">
            {similar.map(item => (
              <MovieCard key={item.id} movie={item} type={type} />
            ))}
          </div>
        </div>
      )}

      {showTrailer && trailer && (
        <TrailerModal
          videoId={trailer.key}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default MovieDetails;

