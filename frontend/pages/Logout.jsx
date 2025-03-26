import { useState, useEffect } from "react";

const Logout = () => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    localStorage.removeItem("token");

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.href = "/login";
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <main>
      <h1>Logout successful.</h1>
      <p>Redirecting to login page in {countdown} seconds...</p>
    </main>
  );
};

export default Logout;
