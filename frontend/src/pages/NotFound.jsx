import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main id="notFoundPage">
      <h1>Page Not Found</h1>
      <Link to="/">
        <button className="errorButton">Go Back</button>
      </Link>
    </main>
  );
};

export default NotFound;
