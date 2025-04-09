import PropTypes from "prop-types";

const NotFound = (error, refetch) => {
  return (
    <main>
      <h1>Error! {error.message}</h1>
      <button className="errorButton" onClick={refetch}>
        Reload
      </button>
    </main>
  );
};

NotFound.propTypes = {
  error: PropTypes.object,
  refetch: PropTypes.func,
};

export default NotFound;
