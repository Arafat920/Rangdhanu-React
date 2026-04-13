import React, { useState } from 'react';

function Navbar({ category, setCategory, handleSearch }) {
  // সার্চ বক্সের ইনপুট সেভ করার জন্য স্টেট
  const [inputValue, setInputValue] = useState('');

  // সার্চ সাবমিট করার ফাংশন (Enter চাপলে বা বাটনে ক্লিক করলে)
  const onSearchSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (inputValue.trim() !== '') {
        handleSearch(inputValue); // App.jsx এর সার্চ লজিক কল হবে
        setInputValue(''); // কাজ শেষে বক্স খালি করা
      }
    }
  };

  return (
    <header className="glass-nav">
      <div className="nav-content">
        {/* লোগো - ক্লিক করলে হোম পেজে ফিরবে */}
        <h1 className="logo" onClick={() => setCategory('home')}>RANGDHANU</h1>

        {/* মেইন মেনু */}
        <nav className="main-nav">
          <span 
            className={category === 'home' ? 'active' : ''} 
            onClick={() => setCategory('home')}
          >
            Home
          </span>
          <span 
            className={category === 'tv' ? 'active' : ''} 
            onClick={() => setCategory('tv')}
          >
            TV Shows
          </span>
          <span 
            className={category === 'movies' ? 'active' : ''} 
            onClick={() => setCategory('movies')}
          >
            Movies
          </span>
          <span 
            className={category === 'mylist' ? 'active' : ''} 
            onClick={() => setCategory('mylist')}
          >
            My List
          </span>
        </nav>

        {/* সার্চ বক্স সেকশন */}
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onSearchSubmit} 
          />
          <button onClick={onSearchSubmit} className="search-btn">🔍</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
