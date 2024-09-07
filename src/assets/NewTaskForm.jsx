import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
export default function NewTaskForm({ requestSearch }) {
  const [value, setValue] = useState("");

  const handleSearch = useCallback(
    debounce((value) => {
      requestSearch(value);
    }, 1000), // Задержка в 500 мс
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value.trim().length === 0) {
      message.warning("Поле не может быть пустым");
      return;
    }
    setValue("");
  };

  useEffect(() => {
    handleSearch(value);
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
