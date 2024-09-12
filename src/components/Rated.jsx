import Ul from './Ul';
import PropTypes from 'prop-types';
export default function Rated({ getGuestSessionFromLocalStorage }) {
  const filmRate = undefined;
  return <Ul film={filmRate} getGuestSessionFromLocalStorage={getGuestSessionFromLocalStorage} />;
}

Rated.propTypes = {
  getGuestSessionFromLocalStorage: PropTypes.func.isRequired,
};
