import Li from "./Li";
import { useState, useEffect } from "react";
import { message } from "antd";
export default function Ul({ film, getGuestSessionFromLocalStorage }) {
  const [updatedFilm, setUpdatedFilm] = useState([]);
  const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;
  const guestSession = getGuestSessionFromLocalStorage(); // Id гостевой сессии

  useEffect(() => {
    fetchRate();
  }, [film]);

  const fetchRate = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${guestSession}/rated/movies?api_key=${moviedbKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const Rate = await response.json();

      const mergedFilms = film.map((filmItem) => {
        const matchingRate = Rate.results.find(
          (rateItem) => rateItem.id === filmItem.id
        );
        return {
          ...filmItem,
          rating: matchingRate ? matchingRate.rating : 0,
        };
      });

      setUpdatedFilm(mergedFilms); // Обновляем состояние
    } catch (error) {
      message.error("Не удалось получить ваши оценки");
    }
  };

  return (
    <ul className="listFilms">
      {updatedFilm.map((item) => (
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
