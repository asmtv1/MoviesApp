import Li from "./Li";

export default function Ul({ film }) {
  return (
    <ul className="listFilms">
      {film.map((item) => (
        <Li key={item.id} film={item} />
      ))}
    </ul>
  );
}
