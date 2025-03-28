import { Link } from "react-router-dom";

const Error = () => {
  return (
    <main>
      <h1>Page Not Found</h1>
      <Link to="/">
        <button className="errorButton">Go Back</button>
      </Link>
    </main>
  );
};

export default Error;
