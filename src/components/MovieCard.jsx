import React from 'react';

function MovieCard({ movie, setSelectedMovie }) {
  const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
  return (
    <div className="movie-card" onClick={setSelectedMovie}>
      <img src={IMG_PATH + movie.poster_path} alt="poster" />
    </div>
  );
}
export default MovieCard;
