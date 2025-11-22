import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import VideoPlayer from './pages/VideoPlayer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ProfileSelection from './pages/ProfileSelection';
import Dashboard from './pages/Dashboard';
import { authService } from './utils/auth';
import './App.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    const savedTheme = currentUser?.preferences?.theme || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          theme: newTheme,
        },
      };
      authService.updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.signOut();
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profiles" element={user ? <ProfileSelection user={user} onSelectProfile={setUser} /> : <Navigate to="/login" />} />
          
          <Route path="/*" element={
            <>
              <Header user={user} onLogout={handleLogout} theme={theme} onThemeChange={handleThemeChange} />
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie/:id" element={<MovieDetails type="movie" />} />
                <Route path="/tv/:id" element={<MovieDetails type="tv" />} />
                <Route path="/watchlist" element={user ? <Watchlist user={user} /> : <Navigate to="/login" />} />
                <Route path="/watch/:type/:id" element={<VideoPlayer user={user} />} />
                <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;

