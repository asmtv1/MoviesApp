import PropTypes from 'prop-types';
import Li from './Li';
import { useState, useEffect } from 'react';
import { message, Alert } from 'antd';

export default function Ul({ film, getGuestSessionFromLocalStorage }) {
  const [updatedFilm, setUpdatedFilm] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;
  const guestSession = getGuestSessionFromLocalStorage(); // Id гостевой сессии

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/guest_session/${guestSession}/rated/movies?api_key=${moviedbKey}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setUpdatedFilm(film);
            throw new Error('404');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const Rate = await response.json();

        if (!Array.isArray(film)) {
          // Это только для Rated.
          if (!Rate || !Array.isArray(Rate.results)) {
            return;
          } else {
            setUpdatedFilm(Rate.results); // Чтобы вывести в Rated только оцененные
          }
        } else {
          const mergedFilms = film.map((filmItem) => {
            const matchingRate = Rate.results.find((rateItem) => rateItem.id === filmItem.id);
            return {
              ...filmItem,
              rating: matchingRate ? matchingRate.rating : 0,
            };
          });

          setUpdatedFilm(mergedFilms);
        }
      } catch (error) {
        if (error.message === '404' || ('401' && !Array.isArray(film))) {
          setShowAlert(true); // если нет оценок, показать в Rated алёрт
        }

        if (error.message === '404' || '401') {
          //message.warning("Вы ещё ничего не оценили"); не уверен, что это нужно
        } else {
          message.error('Интернет сломался :(');
        }
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
              onClose={() => setShowAlert(false)} // Закрытие алерта
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
