import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import MovieCard from './components/MovieCard';
import Admin from './components/Admin'; // Admin ফাইলটি ইমপোর্ট করলাম
import { db } from './firebase'; // Firebase ডাটাবেস ইমপোর্ট করলাম
import { doc, getDoc } from 'firebase/firestore';

const API_KEY = '0f9ff00a0afc741ccd05fcad09b52563';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

function App() {
  const [sections, setSections] = useState([]);
  const [category, setCategory] = useState('home');
  const [heroMovie, setHeroMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [watchlist, setWatchlist] = useState(JSON.parse(localStorage.getItem('appleWatchlist')) || []);
  
  // নতুন স্টেট: মুভি লিঙ্কের জন্য
  const [currentStreamLink, setCurrentStreamLink] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false); // অ্যাডমিন পেজ দেখানোর জন্য

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
    if (category !== 'mylist' && category !== 'search' && category !== 'admin') loadPageData();
  }, [category]);

  const loadPageData = async () => {
    const activeSections = apiPaths[category] || apiPaths.home;
    const loaded = await Promise.all(activeSections.map(async (sec) => {
      const res = await fetch(sec.url);
      const data = await res.json();
      return { ...sec, movies: data.results };
    }));
    setSections(loaded);
    if (loaded[0]) setHeroMovie(loaded[0].movies[0]);
  };

  // মুভি ডিটেইলস ওপেন করার সময় Firebase থেকে লিঙ্ক চেক করবে
  const openDetails = async (movie, type) => {
    const mType = type === 'tv' ? 'tv' : 'movie';
    setSelectedMovie(movie);
    
    // Firebase থেকে লিঙ্ক খোঁজা
    const docRef = doc(db, "movies", movie.id.toString());
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setCurrentStreamLink(docSnap.data().link);
    } else {
      setCurrentStreamLink(null);
    }
  };

  const handleSearch = async (query) => {
    if (!query) return;
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`);
    const data = await res.json();
    setSearchResults(data.results);
    setCategory('search');
  };

  const toggleWatchlist = (movie) => {
    let list = [...watchlist];
    const idx = list.findIndex(m => m.id === movie.id);
    if (idx > -1) list.splice(idx, 1);
    else list.push(movie);
    setWatchlist(list);
    localStorage.setItem('appleWatchlist', JSON.stringify(list));
  };

  const scrollRow = (id, dir) => {
    const el = document.getElementById(id);
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const getTrailer = async (id, type) => {
    const mType = type === 'tv' ? 'tv' : 'movie';
    const res = await fetch(`https://api.themoviedb.org/3/${mType}/${id}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    const trailer = data.results.find(v => v.type === 'Trailer');
    if (trailer) window.open(`https://www.youtube.com/watch?v=${trailer.key}`);
    else alert("Trailer not found!");
  };

  // অ্যাডমিন পেজ টগল করার জন্য (লোগোতে ৫ বার ক্লিক করলে অ্যাডমিন ওপেন হবে - একটি সিক্রেট ট্রিক!)
  let clickCount = 0;
  const secretAdminEntry = () => {
    clickCount++;
    if (clickCount === 5) {
      setCategory('admin');
      clickCount = 0;
    }
  };

  return (
    <div className="App">
      <Navbar category={category} setCategory={setCategory} handleSearch={handleSearch} secretAdminEntry={secretAdminEntry} />

      {category === 'admin' ? (
        <Admin />
      ) : (
        <>
          {category !== 'search' && category !== 'mylist' && heroMovie && (
            <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${IMG_PATH + heroMovie.backdrop_path})` }}>
              <div className="hero-inner">
                <h1>{heroMovie.title || heroMovie.name}</h1>
                <p>{heroMovie.overview?.substring(0, 160)}...</p>
                <button className="btn-apple btn-fill" onClick={() => openDetails(heroMovie, 'movie')}>View Details</button>
              </div>
            </section>
          )}

          <main className="main-content">
            {category === 'search' ? (
              <div className="search-overlay">
                <button className="close-search" onClick={() => setCategory('home')}>✕</button>
                <div className="search-grid">
                  {searchResults.map(m => m.poster_path && <MovieCard key={m.id} movie={m} setSelectedMovie={(m) => openDetails(m, m.media_type)} />)}
                </div>
              </div>
            ) : category === 'mylist' ? (
              <div className="row-container">
                <h2>My Watchlist</h2>
                <div className="search-grid">
                  {watchlist.map(m => <MovieCard key={m.id} movie={m} setSelectedMovie={(m) => openDetails(m, m.mType)} />)}
                </div>
              </div>
            ) : (
              sections.map((sec, idx) => (
                <div key={idx} className="row-container">
                  <h2>{sec.title}</h2>
                  <div className="row-wrapper">
                    <button className="scroll-handle left-handle" onClick={() => scrollRow(`row-${idx}`, -1)}>&#10094;</button>
                    <div id={`row-${idx}`} className="movie-row">
                      {sec.movies.map(m => m.poster_path && <MovieCard key={m.id} movie={m} setSelectedMovie={(m) => openDetails(m, sec.type)} />)}
                    </div>
                    <button className="scroll-handle right-handle" onClick={() => scrollRow(`row-${idx}`, 1)}>&#10095;</button>
                  </div>
                </div>
              ))
            )}
          </main>
        </>
      )}

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setSelectedMovie(null)}>✕</span>
            <div className="modal-body">
              <img src={IMG_PATH + selectedMovie.poster_path} alt="poster" style={{width:'100%', borderRadius:'15px'}} />
              <div className="modal-info">
                <h2>{selectedMovie.title || selectedMovie.name}</h2>
                <p style={{color:'#aaa'}}>⭐ {selectedMovie.vote_average?.toFixed(1)} | {selectedMovie.release_date || selectedMovie.first_air_date}</p>
                <p style={{margin:'20px 0', color:'#ddd', lineHeight:'1.6'}}>{selectedMovie.overview}</p>
                <div className="modal-btns">
                  <button className="btn-apple btn-fill" onClick={() => getTrailer(selectedMovie.id, selectedMovie.media_type || 'movie')}>▶ Watch Trailer</button>
                  
                  {/* যদি Firebase-এ লিঙ্ক থাকে তবে Watch Now বাটন দেখাবে */}
                  {currentStreamLink && (
                    <button className="btn-apple btn-fill" style={{background: '#00d41d', color: '#fff', marginLeft: '10px'}} onClick={() => window.open(currentStreamLink, '_blank')}>
                      ▶ Watch Now
                    </button>
                  )}

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
