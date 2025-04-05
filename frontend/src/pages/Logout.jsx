import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context.jsx";
import { toast } from "sonner";

const Logout = () => {
  const [countdown, setCountdown] = useState(3);
  const {
    updateConversationData,
    updateFriendsData,
    setOnlineUsers,
    setProfile,
    updateRequestData,
    setHasToken,
  } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });
        setHasToken(false);
        updateConversationData(null);
        updateFriendsData(null);
        setOnlineUsers(null);
        setProfile(null);
        updateRequestData(null);
      } catch (err) {
        toast.error(err.message);
      }
    };

    handleLogout();
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
  }, [
    navigate,
    setHasToken,
    updateConversationData,
    updateFriendsData,
    setOnlineUsers,
    setProfile,
    updateRequestData,
  ]);

  return (
    <main>
      <h1>Logout successful.</h1>
      <p>Redirecting to login page in {countdown} seconds...</p>
    </main>
  );
};

export default Logout;
