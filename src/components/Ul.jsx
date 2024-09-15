import { mergeFilmsWithRatings, handleError } from '../utils';
import { fetchFilmsRare } from '../api';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Alert } from 'antd';
import Li from './Li';

export default function Ul({ film, getGuestSessionFromLocalStorage }) {
  const [updatedFilm, setUpdatedFilm] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;
  const guestSession = getGuestSessionFromLocalStorage(); // Id гостевой сессии

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const Rate = await fetchFilmsRare(guestSession, setUpdatedFilm, film);

        if (!Array.isArray(film)) {
          //Только для Rated
          if (!Rate || !Array.isArray(Rate.results)) {
            return;
          } else {
            setUpdatedFilm(Rate.results); // Чтобы вывести в Rated только оцененные
          }
        } else {
          const mergedFilms = mergeFilmsWithRatings(film, Rate.results);
          setUpdatedFilm(mergedFilms);
        }
      } catch (error) {
        handleError(error, setShowAlert, !Array.isArray(film));
      }
    };

    fetchRate();
  }, [film, guestSession, moviedbKey]);

  return (
    <ul className="listFilms">
      {!Array.isArray(updatedFilm) || updatedFilm.length === 0
        ? showAlert && (
            <Alert
              className="alert-container"
              type="error"
              message="Какая жалость, что"
              description="Вы ещё ничего не оценили"
              closable
              onClose={() => setShowAlert(false)}
            />
          )
        : updatedFilm.map((item) => (
            <Li
              key={item.id}
              film={item}
              getGuestSessionFromLocalStorage={getGuestSessionFromLocalStorage}
              Rating={String(item.rating)}
            />
          ))}
    </ul>
  );
}

Ul.propTypes = {
  film: PropTypes.undefined,
  film: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        rating: PropTypes.number,
      })
    ),
  ]),

  getGuestSessionFromLocalStorage: PropTypes.func.isRequired,
};
