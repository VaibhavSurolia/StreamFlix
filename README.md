# StreamFlix - Netflix-like Streaming Platform

A modern, cinematic streaming platform built with React and Vite.

## Features

- 🎬 Browse movies and TV shows by categories
- 🔐 User authentication (Signup, Login, Logout, Forgot Password)
- 📋 Watchlist functionality
- 🎯 AI-based recommendations
- 🔍 Advanced search with filters
- 📱 Fully responsive design
- 🎨 Dark/Light theme toggle
- 👤 Multiple user profiles
- ⭐ Reviews and ratings system

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## API Configuration

This app uses The Movie Database (TMDB) API for movie data. You'll need to:

1. Sign up for a free account at https://www.themoviedb.org/
2. Go to Settings > API and request an API key
3. Create a `.env` file in the root directory:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```
4. The app will use a demo key if no API key is provided, but it's recommended to use your own key for better rate limits.

## Tech Stack

- React 18
- React Router DOM
- Vite
- Axios
- TMDB API

