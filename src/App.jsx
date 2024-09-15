import { useState, useEffect, useCallback, createContext } from 'react';
import Ul from './components/Ul';
import './App.css';
import { Spin, Alert, message } from 'antd';
import 'antd/dist/reset.css'; // Для Ant Design v5
import { Offline, Online } from 'react-detect-offline';
import NewTaskForm from './components/NewTaskForm';
import PaginatedComponent from './components/PaginatedComponent/PaginatedComponent';
import TabsSection from './components/TabsSection/TabsSection';
import Rated from './components/Rated';
import { fetchGenres, searchFilms } from './api';
import { getGuestSessionFromLocalStorage, getGuestSession } from './utils';

export const MyContext = createContext([]);
let genre = [];

function App() {
  const [showAlert, setShowAlert] = useState(false);
  const [film, setfilm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaginatedComponent, setPaginatedComponent] = useState(false);
  const [tab, setTab] = useState('Search');

  getGuestSession();

  const fetchFilms = async () => {
    if (genre.length === 0) {
      try {
        genre = await fetchGenres();
      } catch (error) {
        setShowAlert(true); // Окно с траблом
      }
    }

    try {
      setLoading(true);
      let data = await searchFilms(query, currentPage);
      setTotalPages(data.total_pages);
      data = data.results.slice(0, 6);
      if (data.length === 0 && query !== '') message.error('НЕКОРЕКТНОЕ НАЗВАНИЕ ФИЛЬМА');
      setfilm(data);
      setPaginatedComponent(true);
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
          <TabsSection
            onChange={(current) => {
              setTab(current);
              setQuery('');
              fetchFilms();
            }}
          />
          {tab === 'Search' && (
            <>
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
                  <Ul film={film} getGuestSessionFromLocalStorage={getGuestSessionFromLocalStorage} />
                </MyContext.Provider>
                {showPaginatedComponent && (
                  <PaginatedComponent totalPages={totalPages} changePage={changePage} currentPage={currentPage} />
                )}
              </Spin>
            </>
          )}

          {tab === 'Rated' && <Rated getGuestSessionFromLocalStorage={getGuestSessionFromLocalStorage} />}
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
