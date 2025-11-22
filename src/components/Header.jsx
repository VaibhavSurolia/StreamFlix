import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import './Header.css';

const Header = ({ user, onLogout, theme, onThemeChange }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">StreamFlix</span>
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          {user && <Link to="/watchlist" className="nav-link">My List</Link>}
        </nav>

        <div className="header-actions">
          <button 
            className="search-btn" 
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>

          {showSearch && (
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-input"
              />
              <button type="submit" className="search-submit">Search</button>
            </form>
          )}

          <button 
            className="theme-toggle" 
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="user-menu">
              <button 
                className="user-btn"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {user.profiles?.find(p => p.id === user.currentProfile)?.avatar || '👤'}
                </div>
              </button>
              
              {showMenu && (
                <div className="user-dropdown">
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setShowMenu(false)}>
                    Dashboard
                  </Link>
                  <Link to="/profiles" className="dropdown-item" onClick={() => setShowMenu(false)}>
                    Manage Profiles
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

