import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main>
      <h1>Error! Something went wrong.</h1>
      <Link to="/">
        <button className="errorButton">Go Back</button>
      </Link>
    </main>
  );
};

export default NotFound;
