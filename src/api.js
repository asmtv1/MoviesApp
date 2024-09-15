const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;

export const fetchGenres = async () => {
  const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${moviedbKey}`);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const data = await response.json();
  return data.genres;
};

export const fetchGuestSession = async () => {
  const response = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${moviedbKey}`);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return await response.json();
};

export const searchFilms = async (query, currentPage) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${moviedbKey}&query=${query}&include_adult=false&language=en-US&page=${currentPage}`
  );
  if (!response.ok) throw new Error();

  return await response.json();
};

export const fetchFilmsRare = async (guestSession, setUpdatedFilm, film) => {
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
  return await response.json();
};

export const submitRating = async (movieId, rating, guestSessionId, moviedbKey) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${moviedbKey}&guest_session_id=${guestSessionId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      value: rating,
    }),
  });

  if (!response.ok) {
    throw new Error('Ошибка при отправке рейтинга');
  }

  return response.json();
};
