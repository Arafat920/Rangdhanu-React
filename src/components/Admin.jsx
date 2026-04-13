import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Admin() {
  const [id, setId] = useState('');
  const [link, setLink] = useState('');

  const save = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "movies", id), { link: link });
      alert("Saved Successfully!");
      setId(''); setLink('');
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ padding: '120px 5%', background: '#000', minHeight: '100vh' }}>
      <h2 style={{color:'#ff3b30'}}>Admin Panel</h2>
      <form onSubmit={save} style={{marginTop:'20px'}}>
        <input type="text" placeholder="Movie ID" value={id} onChange={(e) => setId(e.target.value)} style={{padding:'12px', width:'100%', marginBottom:'10px', borderRadius:'8px'}} /><br/>
        <input type="text" placeholder="Streaming Link" value={link} onChange={(e) => setLink(e.target.value)} style={{padding:'12px', width:'100%', marginBottom:'20px', borderRadius:'8px'}} /><br/>
        <button type="submit" className="btn-apple btn-fill">Save Link</button>
      </form>
    </div>
  );
}
export default Admin;
