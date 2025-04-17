import { useRouteError, useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";

const ErrorPage = () => {
  const error = useRouteError();
  const location = useLocation();
  console.log({ error, location });
  return (
    <main>
      <h1>Error! {error.message}</h1>
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
