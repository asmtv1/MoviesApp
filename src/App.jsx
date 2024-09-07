import { useState, useEffect } from "react";
import Ul from "./assets/Ul";
import "./App.css";
import { Spin, Alert, message, Pagination, Table } from "antd";
import "antd/dist/reset.css"; // Для Ant Design v5
import { Offline, Online } from "react-detect-offline";
import NewTaskForm from "./assets/NewTaskForm";
import PaginatedComponent from "./assets/PaginatedComponent";

const moviedbKey = import.meta.env.VITE_THEMOVIEDB_KEY;

function App() {
  const [showAlert, setShowAlert] = useState(false);
  const [film, setfilm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaginatedComponent, setPaginatedComponent] = useState(false);

  const fetchFilms = async (searchQuery) => {
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
      setLoading((privValue) => !privValue);
    } catch (error) {
      setShowAlert(true);
    } finally {
      setLoading(false);
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
            <Ul film={film} />
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
