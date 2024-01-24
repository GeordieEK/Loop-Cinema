import './styles/Carousel.css';
import { useEffect, useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { fetchTrailers } from '../data/trailers';

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stored data on mount
  useEffect(() => {
    const fetchData = async () => {
      const storedVideos = await fetchTrailers();
      setVideos(storedVideos);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Change video based on video length
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setCurrentIndex((currentIndex + 1) % videos.length);
      }, videos[currentIndex].length * 1000); // Convert time to ms
      return () => clearTimeout(timer); // cleanup on unmount or before next effect runs
    }
  }, [currentIndex, videos, loading]);

  const handleMove = (direction: string) => {
    const nextIndex =
      direction === 'left'
        ? (currentIndex - 1 + videos.length) % videos.length
        : (currentIndex + 1) % videos.length;
    setCurrentIndex(nextIndex);
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className="carousel">
      {loading ? (
        <p>Loading...</p> //TODO: Animated spinner
      ) : (
        <>
          <iframe
            id="carousel-content"
            src={currentVideo.src}
            title={currentVideo.title}
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            frameBorder="0"
          ></iframe>
          <div
            id="cinema-crowd"
            style={{ backgroundImage: 'url(cinema-crowd.png)' }}
          />
          <div>
            <button id="carousel-left-button" className='carousellium'>
              <BsChevronCompactLeft
                size={25}
                onClick={() => handleMove('left')}
              />
            </button>
            <button id="carousel-right-button" className='carousellium'>
              <BsChevronCompactRight
                size={25}
                onClick={() => handleMove('right')}
              />
            </button>
          </div>
          <p className="">{currentVideo.alt}</p>
        </>
      )}
    </div>
  );
}

export default Carousel;
