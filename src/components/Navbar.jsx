import React from 'react';

function Navbar({ category, setCategory }) {
  return (
    <header>
      <div className="nav-content">
        <h1 className="logo" onClick={() => setCategory('home')}>RANGDHANU</h1>
        <nav className="main-nav">
          <span className={category === 'home' ? 'active' : ''} onClick={() => setCategory('home')}>Home</span>
          <span className={category === 'tv' ? 'active' : ''} onClick={() => setCategory('tv')}>TV Shows</span>
          <span className={category === 'movies' ? 'active' : ''} onClick={() => setCategory('movies')}>Movies</span>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
