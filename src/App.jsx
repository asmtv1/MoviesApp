import { useState, useEffect } from "react";
import Ul from "./assets/Ul";
import "./App.css";
import { Spin, Alert } from "antd";
import "antd/dist/reset.css"; // Для Ant Design v5

const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;

function App() {
  const [showAlert, setShowAlert] = useState(false);
  const [film, setfilm] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchFilms = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${moviedbKey}&query=return&include_adult=false&language=en-US&page=1`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      data = data.results.slice(0, 6);
      setfilm(data);
      setLoading((privValue) => !privValue);
    } catch (error) {
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFilms();
  }, []);

  return (
    <>
      <Spin spinning={loading}>
        <div className="background">
          {showAlert && (
            <Alert
              className="alert-container"
              type="error"
              message="Ошибка!"
              description="Ошибка получения данных с сервера"
              closable
              onClose={() => setShowAlert(false)} // Закрытие алерта
            />
          )}
          <Ul film={film} />
        </div>
      </Spin>
    </>
  );
}

export default App;
