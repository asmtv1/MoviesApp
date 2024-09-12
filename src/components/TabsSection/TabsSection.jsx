import './tabsSection.css';
import PropTypes from 'prop-types';
export default function TabsSection({ onChange }) {
  return (
    <section className="button_section">
      <input
        type="radio"
        id="Search"
        name="radio-group"
        className="custom-radio-button"
        onClick={() => onChange('Search')}
        defaultChecked
      />
      <label htmlFor="Search" className="togle_label_button">
        Search
      </label>

      <input
        type="radio"
        id="Rated"
        name="radio-group"
        className="custom-radio-button"
        onClick={() => onChange('Rated')}
      />
      <label htmlFor="Rated" className="togle_label_button">
        Rated
      </label>
    </section>
  );
}
TabsSection.propTypes = {
  onChange: PropTypes.func.isRequired,
};
