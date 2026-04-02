import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '0f9ff00a0afc741ccd05fcad09b52563';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

function App() {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState('home');
  const [heroMovie, setHeroMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`;
    if (category === 'tv') url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`;
    if (category === 'movies') url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    setMovies(data.results);
    setHeroMovie(data.results[0]);
  };

  return (
    <div className="App">
      <header id="navbar">
        <h1 className="logo" onClick={() => setCategory('home')}>RANGDHANU</h1>
        <nav className="main-nav">
          <span className={category === 'home' ? 'active' : ''} onClick={() => setCategory('home')}>Home</span>
          <span className={category === 'tv' ? 'active' : ''} onClick={() => setCategory('tv')}>TV Shows</span>
          <span className={category === 'movies' ? 'active' : ''} onClick={() => setCategory('movies')}>Movies</span>
        </nav>
      </header>

      {heroMovie && (
        <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${IMG_PATH + heroMovie.backdrop_path})` }}>
          <div className="hero-inner">
            <h1>{heroMovie.title || heroMovie.name}</h1>
            <p>{heroMovie.overview.substring(0, 150)}...</p>
            <button className="btn-apple" onClick={() => setSelectedMovie(heroMovie)}>View Details</button>
          </div>
        </section>
      )}

      <main className="row-container">
        <h2>Trending Now</h2>
        <div className="movie-row">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card" onClick={() => setSelectedMovie(movie)}>
              <img src={IMG_PATH + movie.poster_path} alt={movie.title} />
            </div>
          ))}
        </div>
      </main>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={IMG_PATH + selectedMovie.poster_path} style={{ width: '100%', borderRadius: '15px' }} />
            <div style={{ padding: '20px' }}>
              <h2 style={{ color: '#ff3b30' }}>{selectedMovie.title || selectedMovie.name}</h2>
              <p style={{ margin: '15px 0', fontSize: '14px', lineHeight: 1.6 }}>{selectedMovie.overview}</p>
              <button className="btn-apple" onClick={() => setSelectedMovie(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
