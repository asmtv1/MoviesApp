import { useState, useEffect } from "react";
import { message } from "antd";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
export default function NewTaskForm({ requestSearch }) {
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");

  const debouncedSearch = debounce((searchValue) => {
    requestSearch(searchValue);
    console.log("Отправка запроса на сервер с запросом:", searchValue);
  }, 500);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value.trim().length === 0) {
      message.warning("Поле не может быть пустым");
      return;
    }
    setQuery(value);
    setValue("");
  };

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type to search..."
      />
    </form>
  );
}
NewTaskForm.propTypes = {
  requestSearch: PropTypes.func.isRequired,
};
