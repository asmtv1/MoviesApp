import { useState, useEffect } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { createDebouncedFunction, isValueEmpty } from '../utils';

export default function NewTaskForm({ requestSearch }) {
  const [value, setValue] = useState('');
  const debouncedRequestSearch = createDebouncedFunction((value) => {
    requestSearch(value);
  }, 1000);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValueEmpty(value)) {
      message.warning('Поле не может быть пустым');
      return;
    }
    setValue('');
  };

  useEffect(() => {
    debouncedRequestSearch(value);
    return () => {
      debouncedRequestSearch.cancel();
    };
  }, [value]);

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
