import { parseISO, format } from "date-fns";
import { ru } from "date-fns/locale";
import { Rate } from "antd";

export default function Li({ film }) {
  let parsedDate;
  console.log(film);
  try {
    parsedDate = format(parseISO(film.release_date), "LLLL d, yyyy", {
      locale: ru,
    });
  } catch (error) {
    parsedDate = "Дата неизвестна";
  }

  const style = {
    borderColor:
      film.vote_average <= 3
        ? "#E90000"
        : film.vote_average <= 5
        ? "#E97E00"
        : film.vote_average <= 7
        ? "#F4F400"
        : "#66E900",
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
        <div className="rating" style={style}>
          {film.vote_average.toFixed(1)}
        </div>
        <p className="release">{parsedDate} </p>
        <div>
          <p className="genre">Action</p>
          <p className="genre">Drama</p>
        </div>
        <p className="description">{film.overview}</p>

        <Rate className="rate" defaultValue={3} />
      </div>
    </li>
  );
}
