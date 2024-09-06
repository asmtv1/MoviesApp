import { useState, useEffect } from "react";
import Ul from "./assets/Ul";
import "./App.css";
const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;

function App() {
  const [film, setfilm] = useState([]);
  const fetchFilms = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${moviedbKey}&query=return&include_adult=false&language=en-US&page=1`
      );
      let data = await response.json();
      data = data.results.slice(0, 6);
      setfilm(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFilms();
  }, []);

  return (
    <>
      <div className="background">
        <Ul film={film} />
      </div>
    </>
  );
}

export default App;
