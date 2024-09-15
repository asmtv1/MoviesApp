import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { MyContext } from '../App';
import { Rate } from 'antd';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { submitRating } from '../api';
import { getParsedDate, getRatingStyle, isMobileDevice } from '../utils';
const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;
export default function Li({ film, getGuestSessionFromLocalStorage, Rating }) {
  const genresFromContext = useContext(MyContext);
  const ratingNumber = Number(Rating);
  const [rating, setRating] = useState(ratingNumber);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const parsedDate = getParsedDate(film.release_date);
  const guestSession = getGuestSessionFromLocalStorage(); // Id гостевой сессии

  const handleChange = (guestSessionId, movieId, rating) => {
    setRating(rating); // Обновляем рейтинг

    submitRating(movieId, rating, guestSessionId, moviedbKey)
      .then(() => {
        message.info('Рейтинг успешно добавлен');
      })
      .catch(() => {
        message.error('Ошибка при отправке рейтинга');
      });
  };
  //для мобилки другой флекс буду рисовать
  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <li className="list">
        <div className="cover">
          <img
            src={film.poster_path ? `https://image.tmdb.org/t/p/w500/${film.poster_path}` : '/Rectangle.jpg'}
            width="60px"
            height="100%"
            alt={`${film.original_title} Film "Logo"`}
          />
          <div className="info">
            <h1 className="title">{film.original_title}</h1>
            <div className="rating" style={getRatingStyle(film.vote_average)}>
              {film.vote_average.toFixed(1)}
            </div>
            <p className="release">{parsedDate} </p>
            <div className="genre_wraper">
              {film.genre_ids.map((item) => {
                const matchingGenre = genresFromContext.find((genresItem) => genresItem.id === item);
                return matchingGenre ? (
                  <p key={matchingGenre.id} className="genre">
                    {matchingGenre.name}
                  </p>
                ) : null;
              })}
            </div>
          </div>
        </div>
        <div>
          <p className="description">{film.overview}</p>
        </div>
        <Rate
          className="rate"
          allowHalf
          count={10}
          value={rating}
          onChange={(value) => handleChange(guestSession, film.id, value)}
        />
      </li>
    );
  }
  // для компа другой флекс
  return (
    <li className="list">
      <div className="cover">
        <img
          src={film.poster_path ? `https://image.tmdb.org/t/p/w500/${film.poster_path}` : '/Rectangle.jpg'}
          height="100%"
          width="183"
          alt={`${film.original_title} Film "Logo"`}
        />
      </div>

      <div className="info">
        <h1 className="title">{film.original_title}</h1>
        <div className="rating" style={getRatingStyle(film.vote_average)}>
          {film.vote_average.toFixed(1)}
        </div>
        <p className="release">{parsedDate} </p>
        <div className="genre_wraper">
          {film.genre_ids.map((item) => {
            const matchingGenre = genresFromContext.find((genresItem) => genresItem.id === item);
            return matchingGenre ? (
              <p key={matchingGenre.id} className="genre">
                {matchingGenre.name}
              </p>
            ) : null;
          })}
        </div>

        <p className="description">{film.overview}</p>

        <Rate
          className="rate"
          allowHalf
          count={10}
          value={rating}
          onChange={(value) => handleChange(guestSession, film.id, value)}
        />
      </div>
    </li>
  );
}
Li.propTypes = {
  film: PropTypes.shape({
    release_date: PropTypes.string,
    poster_path: PropTypes.string,
    original_title: PropTypes.string,
    vote_average: PropTypes.number,
    genre_ids: PropTypes.arrayOf(PropTypes.number),
    overview: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
  getGuestSessionFromLocalStorage: PropTypes.func.isRequired,
  Rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
