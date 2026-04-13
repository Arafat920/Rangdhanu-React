import React, { useState } from 'react';

function Navbar({ category, setCategory, handleSearch }) {
  const [input, setInput] = useState('');

  const onSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      handleSearch(input); setInput('');
    }
  };

  const startVoice = () => {
    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.onresult = (e) => { const q = e.results[0][0].transcript; handleSearch(q); };
    rec.start();
  };

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
          <input type="text" placeholder="Search..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onSearch} />
          <button className="voice-btn" onClick={startVoice}>🎤</button>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
