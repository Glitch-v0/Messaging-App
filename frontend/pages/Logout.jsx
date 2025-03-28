import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");

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
