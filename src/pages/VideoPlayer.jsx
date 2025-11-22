import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieVideos } from '../utils/api';
import { authService } from '../utils/auth';
import './VideoPlayer.css';

const VideoPlayer = ({ user }) => {
  const { type, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [subtitles, setSubtitles] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, videosData] = await Promise.all([
          getMovieDetails(id, type),
          getMovieVideos(id, type),
        ]);
        setMovie(movieData);
        setVideos(videosData);

        // Load saved progress
        if (user) {
          const continueWatching = user.continueWatching?.find(
            cw => cw.id === parseInt(id) && cw.type === type
          );
          if (continueWatching) {
            setProgress(continueWatching.progress);
            setCurrentTime((continueWatching.progress / 100) * (movieData.runtime * 60 || 120 * 60));
          }
        }
      } catch (error) {
        console.error('Error fetching video data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, type, user]);

  useEffect(() => {
    if (isPlaying && user) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const totalTime = (movie?.runtime || 120) * 60;
          const newProgress = (newTime / totalTime) * 100;
          setProgress(newProgress);

          // Save progress every 10 seconds
          if (Math.floor(newTime) % 10 === 0) {
            authService.addContinueWatching(
              {
                id: parseInt(id),
                title: movie?.title || movie?.name,
                poster: movie?.poster_path,
                type,
              },
              newProgress
            );
          }

          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, user, movie, id, type]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    const totalTime = (movie?.runtime || 120) * 60;
    setCurrentTime((newProgress / 100) * totalTime);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <h2>Content not found</h2>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      <div className="player-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <Link to={`/${type}/${id}`} className="player-title">
          {movie.title || movie.name}
        </Link>
      </div>

      <div className="player-container">
        {trailer ? (
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&rel=0`}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            />
          </div>
        ) : (
          <div className="video-placeholder">
            <div className="placeholder-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <h3>Video not available</h3>
              <p>This content is not available for streaming</p>
            </div>
          </div>
        )}

        <div className="player-controls">
          <div className="progress-container">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="progress-bar"
            />
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime((movie.runtime || 120) * 60)}</span>
            </div>
          </div>

          <div className="controls-row">
            <button className="control-btn" onClick={handlePlayPause}>
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="quality-select">
              <label>Quality:</label>
              <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>

            <label className="subtitle-toggle">
              <input
                type="checkbox"
                checked={subtitles}
                onChange={(e) => setSubtitles(e.target.checked)}
              />
              <span>Subtitles</span>
            </label>

            <div className="player-info">
              <h3>{movie.title || movie.name}</h3>
              <p>{movie.overview}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

