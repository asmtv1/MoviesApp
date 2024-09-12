import "./tabsSection.css";
export default function TabsSection({ onChange }) {
  return (
    <section className="button_section">
      <label className="togle_label_button">
        Search
        <input
          type="radio"
          className="custom-radio-button"
          onClick={() => onChange("Search")}
          
        />
      </label>
      <label className="togle_label_button">
        Rated
        <input
          type="radio"
          className="custom-radio-button"
          onClick={() => onChange("Rated")}
   
        />
      </label>
    </section>
  );
}
