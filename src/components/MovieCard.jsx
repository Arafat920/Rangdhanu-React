import React from 'react';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

function MovieCard({ movie, setSelectedMovie }) {
  return (
    <div className="movie-card" onClick={() => setSelectedMovie(movie)}>
      <img src={IMG_PATH + movie.poster_path} alt={movie.title || movie.name} />
    </div>
  );
}

export default MovieCard;
