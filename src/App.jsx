import { useState } from "react";
import Li from "./assets/li";
import "./App.css";
const moviedbKey = process.env.THEMOVIEDB_KEY;
function App() {
  return (
    <>
      <div className="background">
        <ul className="listFilms">
          <Li />
          <Li />
          <Li />
          <Li />
          <Li />
          <Li />
        </ul>
      </div>
    </>
  );
}

export default App;
