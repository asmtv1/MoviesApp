import { parseISO, format } from "date-fns";
import { ru } from "date-fns/locale";
export default function Li({ film }) {
  const parsedDate = format(parseISO(film.release_date), "LLLL d, yyyy", {
    locale: ru,
  });

  return (
    <li>
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
        <p className="release">{parsedDate} </p>
        <div>
          <p className="genre">Action</p>
          <p className="genre">Drama</p>
        </div>
        <p className="description">{film.overview}</p>
      </div>
    </li>
  );
}
