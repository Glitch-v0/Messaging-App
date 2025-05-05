import { useRouteError, useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";

const ErrorPage = () => {
  const error = useRouteError();
  const location = useLocation();
  console.log({ error, location });
  return (
    <main id="errorPage">
      <h1>Error! {error ? error.message : "Please try again"}</h1>
      <Link to={location}>
        <button className="errorButton">Reload</button>
      </Link>
    </main>
  );
};

ErrorPage.propTypes = {
  goToLink: PropTypes.string,
};

export default ErrorPage;
