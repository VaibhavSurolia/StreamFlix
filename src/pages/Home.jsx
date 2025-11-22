import { useState, useEffect } from 'react';
import { getTrending, getPopular, getTopRated, getUpcoming, getNowPlaying } from '../utils/api';
import { authService } from '../utils/auth';
import HeroBanner from '../components/HeroBanner';
import Carousel from '../components/Carousel';
import './Home.css';

const Home = ({ user }) => {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, popularMoviesData, popularTVData, topRatedData, upcomingData] = 
          await Promise.all([
            getTrending('all', 'day'),
            getPopular('movie'),
            getPopular('tv'),
            getTopRated('movie'),
            getUpcoming('movie'),
          ]);

        setTrending(trendingData);
        setPopularMovies(popularMoviesData);
        setPopularTV(popularTVData);
        setTopRated(topRatedData);
        setUpcoming(upcomingData);

        // Generate recommendations based on user watchlist
        if (user?.watchlist?.length > 0) {
          // Simple recommendation: mix of trending and top rated
          const recommended = [...trendingData, ...topRatedData]
            .filter((item, index, self) => 
              index === self.findIndex(t => t.id === item.id)
            )
            .slice(0, 20);
          setRecommendations(recommended);
        } else {
          setRecommendations(trendingData.slice(0, 20));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const continueWatching = user?.continueWatching
    ?.sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched))
    .slice(0, 10) || [];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {trending.length > 0 && (
        <HeroBanner movie={trending[0]} />
      )}

      <div className="home-content">
        {user && continueWatching.length > 0 && (
          <Carousel
            title="Continue Watching"
            movies={continueWatching}
            type={continueWatching[0]?.type || 'movie'}
            showProgress={true}
          />
        )}

        {user && recommendations.length > 0 && (
          <Carousel
            title="Recommended for You"
            movies={recommendations}
            type="movie"
          />
        )}

        <Carousel
          title="Trending Now"
          movies={trending.slice(0, 20)}
          type="movie"
        />

        <Carousel
          title="Top 10 Movies This Week"
          movies={trending.slice(0, 10)}
          type="movie"
        />

        <Carousel
          title="Popular Movies"
          movies={popularMovies}
          type="movie"
        />

        <Carousel
          title="Popular TV Shows"
          movies={popularTV}
          type="tv"
        />

        <Carousel
          title="Top Rated"
          movies={topRated}
          type="movie"
        />

        <Carousel
          title="Coming Soon"
          movies={upcoming}
          type="movie"
        />
      </div>
    </div>
  );
};

export default Home;

