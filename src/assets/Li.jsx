import { parseISO, format } from "date-fns";
import { useState, useEffect } from "react";
import { ru } from "date-fns/locale";
import { Rate } from "antd";
import { message } from "antd";
const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;
export default function Li({ film, getGuestSessionFromLocalStorage, Rating }) {
  const ratingNumber = Number(Rating);
  const [rating, setRating] = useState(ratingNumber);
  let parsedDate;
  console.log(film);
  try {
    parsedDate = format(parseISO(film.release_date), "LLLL d, yyyy", {
      locale: ru,
    });
  } catch (error) {
    parsedDate = "Дата неизвестна";
  }

  const ratingStyle = {
    borderColor:
      film.vote_average <= 3
        ? "#E90000"
        : film.vote_average <= 5
        ? "#E97E00"
        : film.vote_average <= 7
        ? "#F4F400"
        : "#66E900",
  };
  const guestSession = getGuestSessionFromLocalStorage(); // Id гостевой сессии

  const handleChange = (guestSessionId, movieId, rating) => {
    console.log(guestSession);
    setRating(rating); // Обновляем рейтинг

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${moviedbKey}&guest_session_id=${guestSessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          value: rating,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Ошибка при отправке рейтинга");
        }
      })
      .then(() => {
        message.info("Рейтинг успешно добавлен");
      })
      .catch((error) => {
        message.error("Ошибка при отправке рейтинга");
      });
  };

  return (
    <li className="list">
      <div className="cover">
        <img
          src={
            film.poster_path
              ? `https://image.tmdb.org/t/p/w500/${film.poster_path}`
              : "/Rectangle.jpg"
          }
          height="100%"
          width="183"
          alt={`${film.original_title} Film "Logo"`}
        />
      </div>

      <div className="info">
        <h1 className="title">{film.original_title}</h1>
        <div className="rating" style={ratingStyle}>
          {film.vote_average.toFixed(1)}
        </div>
        <p className="release">{parsedDate} </p>
        <div>
          <p className="genre">Action</p>
          <p className="genre">Drama</p>
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
