import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import Ul from "./assets/Ul";
import "./App.css";
import { Spin, Alert, message } from "antd";
import "antd/dist/reset.css"; // Для Ant Design v5
import { Offline, Online } from "react-detect-offline";
import NewTaskForm from "./assets/NewTaskForm";
import PaginatedComponent from "./assets/PaginatedComponent";

const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;

export const MyContext = createContext([]);
let genre = [];

const saveGuestSessionToLocalStorage = (guestSession) => {
  const sessionValue = guestSession.guest_session_id;
  const expires = new Date();
  expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 24 часа
  const sessionData = {
    sessionValue,
    expires: expires.getTime(), // Сохраняем срок действия в миллисекундах
  };
  localStorage.setItem("guestSession", JSON.stringify(sessionData));
};
const getGuestSessionFromLocalStorage = () => {
  const sessionData = localStorage.getItem("guestSession");
  if (sessionData) {
    const { sessionValue, expires } = JSON.parse(sessionData);
    // Проверяем, не истек ли срок действия
    if (new Date().getTime() > expires) {
      localStorage.removeItem("guestSession"); // Удаляем устаревшую сессию
      return null;
    }
    return sessionValue;
  } else {
    return null;
  }
};

function App() {
  const [showAlert, setShowAlert] = useState(false);
  const [film, setfilm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaginatedComponent, setPaginatedComponent] = useState(false);

  const fetchFilms = async (searchQuery) => {
    if (genre.length === 0) {
      try {
        const response = await fetch(
          `
    https://api.themoviedb.org/3/genre/movie/list?api_key=${moviedbKey}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        genre = await response.json();
        genre = genre.genres;
      } catch (error) {
        console.error("Error fetching guest session:", error);
        setShowAlert(true); // Окно с траблом
      }
    }

    if (!localStorage.getItem("guestSession")) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${moviedbKey}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const guestSession = await response.json();
        saveGuestSessionToLocalStorage(guestSession);
        console.log(guestSession);
      } catch (error) {
        console.error("Error fetching guest session:", error);
        setShowAlert(true); // Окно с траблом
      }
    }
    try {
      setLoading(true);

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${moviedbKey}&query=${query}&include_adult=false&language=en-US&page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json();
      setTotalPages(data.total_pages);
      data = data.results.slice(0, 6);
      if (data.length === 0) message.error("НЕКОРЕТКТНОЕ НАЗВАНИЕ ФИЛЬМА");
      setfilm(data);
      setPaginatedComponent(true);
      console.log(totalPages);
    } catch (error) {
      setShowAlert(true); // Окно с траблом
    } finally {
      setLoading(false); //убираем крутилку
    }
  };

  useEffect(() => {
    if (query.trim().length > 0) {
      fetchFilms();
    }
  }, [query, currentPage]);

  const requestSearch = (value) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const changePage = (value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Online>
        <div className="background">
          <NewTaskForm requestSearch={requestSearch} />
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
          <Spin className="spin" spinning={loading}>
            <MyContext.Provider value={genre}>
              <Ul
                film={film}
                getGuestSessionFromLocalStorage={
                  getGuestSessionFromLocalStorage
                }
              />
            </MyContext.Provider>
            {showPaginatedComponent && (
              <PaginatedComponent
                totalPages={totalPages}
                changePage={changePage}
                currentPage={currentPage}
              />
            )}
          </Spin>
        </div>
      </Online>
      <Offline>
        <div className="offline">
          <Alert
            type="error"
            message={`Можно было бы навести суету,
но у тебя нет инета :(`}
          />
        </div>
      </Offline>
    </>
  );
}

export default App;
