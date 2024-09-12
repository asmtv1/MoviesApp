import Ul from "./Ul";
export default function Rated({ getGuestSessionFromLocalStorage }) {
  const filmRate = undefined;
  return (
    <Ul
      film={filmRate}
      getGuestSessionFromLocalStorage={getGuestSessionFromLocalStorage}
    />
  );
}
