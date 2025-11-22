import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import './Carousel.css';

const Carousel = ({ title, movies, type = 'movie', showProgress = false }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [movies]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    checkScroll();
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="carousel-section">
      {title && <h2 className="carousel-title">{title}</h2>}
      <div className="carousel-container">
        {canScrollLeft && (
          <button
            className="carousel-btn carousel-btn-left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        
        <div
          className="carousel-scroll"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div className="carousel-content">
            {movies.map((movie) => (
              <div key={movie.id} className="carousel-item">
                <MovieCard movie={movie} type={type} showProgress={showProgress} />
              </div>
            ))}
          </div>
        </div>

        {canScrollRight && (
          <button
            className="carousel-btn carousel-btn-right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Carousel;

