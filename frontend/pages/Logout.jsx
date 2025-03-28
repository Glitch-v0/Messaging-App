import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../src/context.jsx";

const Logout = () => {
  const [countdown, setCountdown] = useState(3);
  const { setHasToken } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");

    setHasToken(false);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <main>
      <h1>Logout successful.</h1>
      <p>Redirecting to login page in {countdown} seconds...</p>
    </main>
  );
};

export default Logout;
