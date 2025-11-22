import axios from 'axios';

// TMDB API Configuration
// Get your free API key from https://www.themoviedb.org/settings/api
// Create a .env file in the root directory and add: VITE_TMDB_API_KEY=your_api_key_here
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '8c4e79b22a8a9911513531b2a0405747'; // Fallback demo key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Image URL helper
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get backdrop image
export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get poster image
export const getPosterUrl = (path, size = 'w500') => {
  return getImageUrl(path, size);
};

// API Functions
export const getTrending = async (type = 'all', timeWindow = 'day') => {
  try {
    const { data } = await api.get(`/trending/${type}/${timeWindow}`);
    return data.results;
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
};

export const getPopular = async (type = 'movie') => {
  try {
    const { data } = await api.get(`/${type}/popular`);
    return data.results;
  } catch (error) {
    console.error('Error fetching popular:', error);
    return [];
  }
};

export const getTopRated = async (type = 'movie') => {
  try {
    const { data } = await api.get(`/${type}/top_rated`);
    return data.results;
  } catch (error) {
    console.error('Error fetching top rated:', error);
    return [];
  }
};

export const getUpcoming = async (type = 'movie') => {
  try {
    const { data } = await api.get(`/${type}/upcoming`);
    return data.results;
  } catch (error) {
    console.error('Error fetching upcoming:', error);
    return [];
  }
};

export const getNowPlaying = async (type = 'movie') => {
  try {
    const { data } = await api.get(`/${type}/now_playing`);
    return data.results;
  } catch (error) {
    console.error('Error fetching now playing:', error);
    return [];
  }
};

export const getGenres = async (type = 'movie') => {
  try {
    const { data } = await api.get(`/genre/${type}/list`);
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

export const getMoviesByGenre = async (genreId, type = 'movie') => {
  try {
    const { data } = await api.get(`/discover/${type}`, {
      params: { with_genres: genreId },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
};

export const getMovieDetails = async (id, type = 'movie') => {
  try {
    const { data } = await api.get(`/${type}/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const getMovieCredits = async (id, type = 'movie') => {
  try {
    const { data } = await api.get(`/${type}/${id}/credits`);
    return data;
  } catch (error) {
    console.error('Error fetching credits:', error);
    return { cast: [], crew: [] };
  }
};

export const getMovieVideos = async (id, type = 'movie') => {
  try {
    const { data } = await api.get(`/${type}/${id}/videos`);
    return data.results;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const searchMovies = async (query, type = 'movie') => {
  try {
    const { data } = await api.get(`/search/${type}`, {
      params: { query },
    });
    return data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getTVShowDetails = async (id) => {
  return getMovieDetails(id, 'tv');
};

export const getTVShowCredits = async (id) => {
  return getMovieCredits(id, 'tv');
};

export const getTVShowVideos = async (id) => {
  return getMovieVideos(id, 'tv');
};

export default api;

