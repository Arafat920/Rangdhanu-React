import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import MovieCard from './components/MovieCard';

const API_KEY = '0f9ff00a0afc741ccd05fcad09b52563';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

function App() {
  const [sections, setSections] = useState([]);
  const [category, setCategory] = useState('home');
  const [heroMovie, setHeroMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [watchlist, setWatchlist] = useState(JSON.parse(localStorage.getItem('appleWatchlist')) || []);

  const apiPaths = {
    home: [
      { title: 'Spotlight Today', url: `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`, type: 'all' },
      { title: 'Top Rated Movies', url: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`, type: 'movie' },
      { title: 'Popular Series', url: `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`, type: 'tv' }
    ],
    tv: [{ title: 'Binge-Worthy Shows', url: `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`, type: 'tv' }],
    movies: [{ title: 'Blockbuster Movies', url: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`, type: 'movie' }]
  };

  useEffect(() => {
    if (category !== 'mylist') loadPageData();
  }, [category]);

  const loadPageData = async () => {
    const activeSections = apiPaths[category];
    const loadedSections = await Promise.all(activeSections.map(async (sec) => {
      const res = await fetch(sec.url);
      const data = await res.json();
      return { ...sec, movies: data.results };
    }));
    setSections(loadedSections);
    if (loadedSections[0]) setHeroMovie(loadedSections[0].movies[0]);
  };

  const scrollRow = (id, direction) => {
    const el = document.getElementById(id);
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  const toggleWatchlist = (movie) => {
    let updatedList = [...watchlist];
    const idx = updatedList.findIndex(m => m.id === movie.id);
    if (idx > -1) updatedList.splice(idx, 1);
    else updatedList.push(movie);
    setWatchlist(updatedList);
    localStorage.setItem('appleWatchlist', JSON.stringify(updatedList));
  };

  const startVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
      const query = event.results[0][0].transcript;
      handleSearch(query);
    };
    recognition.start();
  };

  const handleSearch = async (query) => {
    if (!query) return;
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`);
    const data = await res.json();
    setSearchResults(data.results);
    setCategory('search');
  };

  const getTrailer = async (id, type) => {
    const res = await fetch(`https://api.themoviedb.org/3/${type === 'tv' ? 'tv' : 'movie'}/${id}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    const trailer = data.results.find(v => v.type === 'Trailer');
    if (trailer) window.open(`https://www.youtube.com/watch?v=${trailer.key}`);
    else alert("Trailer not found!");
  };

  return (
    <div className="App">
      <Navbar category={category} setCategory={setCategory} startVoiceSearch={startVoiceSearch} handleSearch={handleSearch} />

      {category !== 'search' && category !== 'mylist' && heroMovie && (
        <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${IMG_PATH + heroMovie.backdrop_path})` }}>
          <div className="hero-inner">
            <h1>{heroMovie.title || heroMovie.name}</h1>
            <p>{heroMovie.overview.substring(0, 160)}...</p>
            <button className="btn-apple btn-fill" onClick={() => setSelectedMovie(heroMovie)}>View Info</button>
          </div>
        </section>
      )}

      <main className="main-content">
        {category === 'search' ? (
          <div className="search-overlay">
            <button className="close-search" onClick={() => setCategory('home')}>✕ Close Search</button>
            <div className="search-grid">
              {searchResults.map(movie => movie.poster_path && <MovieCard key={movie.id} movie={movie} setSelectedMovie={setSelectedMovie} />)}
            </div>
          </div>
        ) : category === 'mylist' ? (
          <div className="row-container">
            <h2>My Watchlist</h2>
            <div className="search-grid">
              {watchlist.map(movie => <MovieCard key={movie.id} movie={movie} setSelectedMovie={setSelectedMovie} />)}
            </div>
          </div>
        ) : (
          sections.map((sec, idx) => (
            <div key={idx} className="row-container">
              <h2>{sec.title}</h2>
              <div className="row-wrapper">
                <button className="scroll-handle left-handle" onClick={() => scrollRow(`row-${idx}`, -1)}>&#10094;</button>
                <div id={`row-${idx}`} className="movie-row">
                  {sec.movies.map(movie => movie.poster_path && <MovieCard key={movie.id} movie={movie} setSelectedMovie={setSelectedMovie} />)}
                </div>
                <button className="scroll-handle right-handle" onClick={() => scrollRow(`row-${idx}`, 1)}>&#10095;</button>
              </div>
            </div>
          ))
        )}
      </main>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setSelectedMovie(null)}>✕</span>
            <div className="modal-body">
              <img src={IMG_PATH + selectedMovie.poster_path} alt="poster" style={{width:'100%', borderRadius:'15px'}} />
              <div className="modal-info">
                <h2>{selectedMovie.title || selectedMovie.name}</h2>
                <p>⭐ {selectedMovie.vote_average?.toFixed(1)} | {selectedMovie.release_date || selectedMovie.first_air_date}</p>
                <p className="modal-overview">{selectedMovie.overview}</p>
                <div className="modal-btns">
                  <button className="btn-apple btn-fill" onClick={() => getTrailer(selectedMovie.id, selectedMovie.media_type)}>▶ Watch Trailer</button>
                  <button className="btn-apple btn-border" onClick={() => toggleWatchlist(selectedMovie)}>
                    {watchlist.some(m => m.id === selectedMovie.id) ? '✕ Remove List' : '+ Add List'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
