import { useState, useEffect } from 'react';
import { authService } from '../utils/auth';
import MovieCard from '../components/MovieCard';
import './Watchlist.css';

const Watchlist = ({ user }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setWatchlist(currentUser.watchlist || []);
    }
  }, []);

  const handleRemove = (id, type) => {
    authService.removeFromWatchlist(id, type);
    const currentUser = authService.getCurrentUser();
    setWatchlist(currentUser.watchlist || []);
  };

  const filteredWatchlist = filter === 'all' 
    ? watchlist 
    : watchlist.filter(item => item.type === filter);

  if (watchlist.length === 0) {
    return (
      <div className="watchlist-page">
        <div className="watchlist-header">
          <h1>My List</h1>
        </div>
        <div className="empty-state">
          <h3>Your watchlist is empty</h3>
          <p>Start adding movies and TV shows to your list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1>My List</h1>
        <div className="watchlist-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'movie' ? 'active' : ''}`}
            onClick={() => setFilter('movie')}
          >
            Movies
          </button>
          <button
            className={`filter-btn ${filter === 'tv' ? 'active' : ''}`}
            onClick={() => setFilter('tv')}
          >
            TV Shows
          </button>
        </div>
      </div>

      <div className="watchlist-content">
        <div className="watchlist-grid">
          {filteredWatchlist.map((item) => (
            <div key={`${item.type}-${item.id}`} className="watchlist-item">
              <MovieCard movie={item} type={item.type} />
              <button
                className="remove-btn"
                onClick={() => handleRemove(item.id, item.type)}
                aria-label="Remove from watchlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;

