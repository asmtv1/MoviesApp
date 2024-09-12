import { useState, useEffect } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

export default function NewTaskForm({ requestSearch }) {
  const [value, setValue] = useState('');

  // Создаем debounce функцию
  const debouncedRequestSearch = debounce((value) => {
    requestSearch(value);
  }, 1000); // Задержка в 1000 мс

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value.trim().length === 0) {
      message.warning('Поле не может быть пустым');
      return;
    }
    setValue('');
  };

  useEffect(() => {
    // Вызываем дебаунс функцию при изменении value
    debouncedRequestSearch(value);

    // Очистка debounce при размонтировании
    return () => {
      debouncedRequestSearch.cancel();
    };
  }, [value, debouncedRequestSearch]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <input
          type="text"
          className="input field__input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder=" "
          id="login"
        />
        <label className="field__lable" htmlFor="login">
          Введите название фильма
        </label>
      </div>
    </form>
  );
}

NewTaskForm.propTypes = {
  requestSearch: PropTypes.func.isRequired,
};
