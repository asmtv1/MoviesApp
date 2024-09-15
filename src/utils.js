import { message } from 'antd';
import debounce from 'lodash/debounce';
import { parseISO, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const saveGuestSessionToLocalStorage = (guestSession) => {
  const sessionValue = guestSession.guest_session_id;
  const expires = new Date();
  expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 24 часа
  const sessionData = {
    sessionValue,
    expires: expires.getTime(), // Сохраняем срок действия в миллисекундах
  };
  localStorage.setItem('guestSession', JSON.stringify(sessionData));
};

export const getGuestSessionFromLocalStorage = () => {
  const sessionData = localStorage.getItem('guestSession');
  if (sessionData) {
    const { sessionValue, expires } = JSON.parse(sessionData);
    // Проверяем, не истек ли срок действия
    if (new Date().getTime() > expires) {
      localStorage.removeItem('guestSession'); // Удаляем устаревшую сессию
      return null;
    }
    return sessionValue;
  } else {
    return null;
  }
};

// Функция для безопасного парсинга даты
export const getParsedDate = (releaseDate) => {
  try {
    return format(parseISO(releaseDate), 'LLLL d, yyyy', { locale: ru });
  } catch (error) {
    return 'Дата неизвестна';
  }
};

// Функция для определения стилей рейтинга
export const getRatingStyle = (voteAverage) => ({
  borderColor: voteAverage <= 3 ? '#E90000' : voteAverage <= 5 ? '#E97E00' : voteAverage <= 7 ? '#F4F400' : '#66E900',
});

// Функция для определения мобильного устройства
export const isMobileDevice = () => window.innerWidth <= 768;

// Функция для слияния фильмов с оценками
export const mergeFilmsWithRatings = (films, ratings) => {
  return films.map((filmItem) => {
    const matchingRate = ratings.find((rateItem) => rateItem.id === filmItem.id);
    return {
      ...filmItem,
      rating: matchingRate ? matchingRate.rating : 0,
    };
  });
};

// Функция для обработки ошибок
export const handleError = (error, setShowAlert, showAlertCondition) => {
  if (error.message === '404' || error.message === '401') {
    if (showAlertCondition) {
      setShowAlert(true); // Показать алерт, если нет оценок
    }
  }

  if (error.message === '404' || '401') {
    //message.warning("Вы ещё ничего не оценили"); не уверен, что это нужно
  } else {
    message.error('Интернет сломался :(');
  }
};

// Функция debounce для обработки запросов
export const createDebouncedFunction = (callback, delay = 1000) => {
  return debounce(callback, delay);
};

// Функция для проверки пустого значения
export const isValueEmpty = (value) => {
  return value.trim().length === 0;
};

import { fetchGuestSession } from './api';

export const getGuestSession = async (setShowAlert) => {
  if (!localStorage.getItem('guestSession')) {
    try {
      const guestSession = await fetchGuestSession();
      saveGuestSessionToLocalStorage(guestSession);
    } catch (error) {
      setShowAlert(true); // Окно с траблом
    }
  }
};
