import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const errorPage = (error, goToLink) => {
  return (
    <main>
      <h1>Error! {error.message}</h1>
      <Link to={goToLink}>
        <button className="errorButton">Reload</button>
      </Link>
    </main>
  );
};

errorPage.propTypes = {
  error: PropTypes.object,
  refetch: PropTypes.func,
};

export default errorPage;
