import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBackdropUrl, getPosterUrl } from '../utils/api';
import { authService } from '../utils/auth';
import './HeroBanner.css';

const HeroBanner = ({ movie }) => {
  const [isMuted, setIsMuted] = useState(true);
  const user = authService.getCurrentUser();
  const isInWatchlist = authService.isInWatchlist(movie.id, 'movie');

  if (!movie) return null;

  const title = movie.title || movie.name;
  const overview = movie.overview || 'No description available.';
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const type = movie.title ? 'movie' : 'tv';

  const handleWatchlistToggle = () => {
    if (!user) return;

    if (isInWatchlist) {
      authService.removeFromWatchlist(movie.id, type);
    } else {
      authService.addToWatchlist({
        id: movie.id,
        title,
        poster: movie.poster_path,
        type,
        releaseDate,
        rating: movie.vote_average,
      });
    }
  };

  return (
    <div className="hero-banner">
      <div className="hero-backdrop">
        <img
          src={getBackdropUrl(movie.backdrop_path)}
          alt={title}
          className="hero-image"
        />
        <div className="hero-gradient"></div>
      </div>

      <div className="hero-content">
        <div className="hero-info">
          <h1 className="hero-title">{title}</h1>
          
          <div className="hero-meta">
            <span className="hero-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
            {year && <span className="hero-year">{year}</span>}
            <span className="hero-type">{type === 'movie' ? 'Movie' : 'TV Show'}</span>
          </div>

          <p className="hero-description">
            {overview.length > 200 ? `${overview.substring(0, 200)}...` : overview}
          </p>

          <div className="hero-actions">
            <Link
              to={`/watch/${type}/${movie.id}`}
              className="hero-btn hero-btn-primary"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </Link>
            
            <Link
              to={`/${type}/${movie.id}`}
              className="hero-btn hero-btn-secondary"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4M12 8h.01"></path>
              </svg>
              More Info
            </Link>

            {user && (
              <button
                className={`hero-btn hero-btn-icon ${isInWatchlist ? 'active' : ''}`}
                onClick={handleWatchlistToggle}
                aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
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
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

