import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../utils/api';
import MovieCard from '../components/MovieCard';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    genre: '',
    year: '',
    rating: '',
  });

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const [movieResults, tvResults] = await Promise.all([
        searchMovies(query, 'movie'),
        searchMovies(query, 'tv'),
      ]);
      
      let filtered = filters.type === 'all' 
        ? [...movieResults, ...tvResults]
        : filters.type === 'movie' 
          ? movieResults 
          : tvResults;

      // Apply filters
      if (filters.year) {
        filtered = filtered.filter(item => {
          const date = item.release_date || item.first_air_date;
          return date && date.startsWith(filters.year);
        });
      }

      if (filters.rating) {
        filtered = filtered.filter(item => 
          item.vote_average >= parseFloat(filters.rating)
        );
      }

      setResults(filtered);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Results</h1>
        {query && <p>Results for "{query}"</p>}
      </div>

      <div className="search-filters">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>

        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="filter-select"
        >
          <option value="">All Years</option>
          {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          className="filter-select"
        >
          <option value="">All Ratings</option>
          <option value="7">7+ Rating</option>
          <option value="8">8+ Rating</option>
          <option value="9">9+ Rating</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="search-results">
          {results.map((item) => (
            <div key={item.id} className="search-result-item">
              <MovieCard movie={item} type={item.title ? 'movie' : 'tv'} />
            </div>
          ))}
        </div>
      ) : query ? (
        <div className="empty-state">
          <h3>No results found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="empty-state">
          <h3>Start searching</h3>
          <p>Use the search bar to find movies and TV shows</p>
        </div>
      )}
    </div>
  );
};

export default Search;

