import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Admin() {
  const [movieId, setMovieId] = useState('');
  const [streamLink, setStreamLink] = useState('');

  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!movieId || !streamLink) return alert("সব ঘর পূরণ করুন!");
    
    try {
      await setDoc(doc(db, "movies", movieId), {
        link: streamLink
      });
      alert("সফলভাবে মুভি লিঙ্ক সেভ হয়েছে!");
      setMovieId(''); setStreamLink('');
    } catch (err) { alert("ভুল হয়েছে: " + err.message); }
  };

  return (
    <div style={{ padding: '100px 5%', background: '#111', color: '#fff', minHeight: '100vh' }}>
      <h2>Admin Panel - Add Streaming Link</h2>
      <form onSubmit={handleAddMovie} style={{ marginTop: '20px' }}>
        <input type="text" placeholder="TMDB Movie ID" value={movieId} onChange={(e) => setMovieId(e.target.value)} style={{ padding: '10px', width: '100%', marginBottom: '10px' }} /><br />
        <input type="text" placeholder="Google Drive Link" value={streamLink} onChange={(e) => setStreamLink(e.target.value)} style={{ padding: '10px', width: '100%', marginBottom: '20px' }} /><br />
        <button type="submit" style={{ padding: '10px 30px', background: '#e50914', color: '#fff', border: 'none', cursor: 'pointer' }}>Save Movie Link</button>
      </form>
    </div>
  );
}

export default Admin;
