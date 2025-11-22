import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosterUrl } from '../utils/api';
import { authService } from '../utils/auth';
import './MovieCard.css';

const MovieCard = ({ movie, type = 'movie', showProgress = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(
    authService.isInWatchlist(movie.id, type)
  );

  const user = authService.getCurrentUser();
  const continueWatching = user?.continueWatching?.find(
    cw => cw.id === movie.id && cw.type === type
  );

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return;
    }

    if (isInWatchlist) {
      authService.removeFromWatchlist(movie.id, type);
      setIsInWatchlist(false);
    } else {
      authService.addToWatchlist({
        id: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path,
        type,
        releaseDate: movie.release_date || movie.first_air_date,
        rating: movie.vote_average,
      });
      setIsInWatchlist(true);
    }
  };

  const progress = continueWatching?.progress || 0;
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <Link
      to={`/${type}/${movie.id}`}
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="movie-card-poster">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={title}
          loading="lazy"
        />
        
        {showProgress && progress > 0 && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {isHovered && (
          <div className="movie-card-overlay">
            <div className="movie-card-actions">
              <Link
                to={`/watch/${type}/${movie.id}`}
                className="play-btn"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </Link>
              
              {user && (
                <button
                  className={`watchlist-btn ${isInWatchlist ? 'active' : ''}`}
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
            
            <div className="movie-card-info">
              <h4>{title}</h4>
              <div className="movie-card-meta">
                <span className="rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                {year && <span className="year">{year}</span>}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {!isHovered && (
        <div className="movie-card-title">
          <h4>{title}</h4>
        </div>
      )}
    </Link>
  );
};

export default MovieCard;

