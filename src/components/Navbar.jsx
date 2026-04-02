import React from 'react';

function Navbar({ category, setCategory, startVoiceSearch, handleSearch }) {
  return (
    <header className="glass-nav">
      <div className="nav-content">
        <h1 className="logo" onClick={() => setCategory('home')}>RANGDHANU</h1>
        <nav className="main-nav">
          <span className={category === 'home' ? 'active' : ''} onClick={() => setCategory('home')}>Home</span>
          <span className={category === 'tv' ? 'active' : ''} onClick={() => setCategory('tv')}>TV Shows</span>
          <span className={category === 'movies' ? 'active' : ''} onClick={() => setCategory('movies')}>Movies</span>
          <span className={category === 'mylist' ? 'active' : ''} onClick={() => setCategory('mylist')}>My List</span>
        </nav>
        <div className="search-wrapper">
          <input type="text" placeholder="Search..." onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)} />
          <button className="voice-btn" onClick={startVoiceSearch}>🎤</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
