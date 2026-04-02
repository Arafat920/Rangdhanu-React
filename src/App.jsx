import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import MovieCard from './components/MovieCard';

const API_KEY = '0f9ff00a0afc741ccd05fcad09b52563';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

function App() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [action, setAction] = useState([]);
  const [category, setCategory] = useState('home');
  const [heroMovie, setHeroMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Trending
      const res1 = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`);
      const data1 = await res1.json();
      setTrending(data1.results);
      setHeroMovie(data1.results[0]);

      // Top Rated
      const res2 = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`);
      const data2 = await res2.json();
      setTopRated(data2.results);

      // Action
      const res3 = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`);
      const data3 = await res3.json();
      setAction(data3.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="App">
      <Navbar category={category} setCategory={setCategory} />

      {heroMovie && (
        <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${IMG_PATH + heroMovie.backdrop_path})` }}>
          <div className="hero-inner">
            <h1>{heroMovie.title || heroMovie.name}</h1>
            <p>{heroMovie.overview.substring(0, 160)}...</p>
            <button className="btn-apple" onClick={() => setSelectedMovie(heroMovie)}>View Details</button>
          </div>
        </section>
      )}

      <main className="main-content">
        <section className="row-container">
          <h2>Trending Now</h2>
          <div className="movie-row">
            {trending.map(movie => (
              <MovieCard key={movie.id} movie={movie} setSelectedMovie={setSelectedMovie} />
            ))}
          </div>
        </section>

        <section className="row-container">
          <h2>Top Rated</h2>
          <div className="movie-row">
            {topRated.map(movie => (
              <MovieCard key={movie.id} movie={movie} setSelectedMovie={setSelectedMovie} />
            ))}
          </div>
        </section>

        <section className="row-container">
          <h2>Action Thriller</h2>
          <div className="movie-row">
            {action.map(movie => (
              <MovieCard key={movie.id} movie={movie} setSelectedMovie={setSelectedMovie} />
            ))}
          </div>
        </section>
      </main>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={IMG_PATH + (selectedMovie.backdrop_path || selectedMovie.poster_path)} alt={selectedMovie.title} style={{ width: '100%', borderRadius: '20px 20px 0 0' }} />
            <div style={{ padding: '25px' }}>
              <h2 style={{ color: '#ff3b30', fontSize: '28px' }}>{selectedMovie.title || selectedMovie.name}</h2>
              <p style={{ margin: '20px 0', fontSize: '16px', lineHeight: 1.6, color: '#ddd' }}>{selectedMovie.overview}</p>
              <button className="btn-apple" onClick={() => setSelectedMovie(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
