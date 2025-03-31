import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppContext } from "./context.jsx";
import routes from "./routes.jsx";

const router = createBrowserRouter(routes);

function App() {
  const [conversationData, updateConversationData] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [friendsData, updateFriendsData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [profile, setProfile] = useState(null);
  const [requestData, updateRequestData] = useState(null);

  const [hasToken, setHasToken] = useState(false);

  const handleDarkMode = () => {
    // read local storage for dark mode
    const isDark = localStorage.getItem("darkMode") === "true";
    const root = document.querySelector(":root");
    // console.log(`Dark mode is set to ${isDark}, ${typeof isDark}`);
    root.style.setProperty("--main-color", isDark ? "#000000" : "#38195e");
    root.style.setProperty(
      "--nav-background-color",
      isDark ? "#0d0d0d" : "#2a1346"
    );
    root.style.setProperty("--font-color", isDark ? "#c5c5c5" : "#fde2ff");
    root.style.setProperty(
      "--button-background-color",
      isDark ? "#252525" : "#2a1346"
    );
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/whoami`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setHasToken(data.authenticated); // Update based on backend response
        setProfile(data.user || null);
        handleDarkMode();
      })
      .catch(() => setHasToken(false));
  }, []);

  return (
    <AppContext.Provider
      value={{
        conversationData,
        updateConversationData,
        currentConversation,
        setCurrentConversation,
        friendsData,
        updateFriendsData,
        onlineUsers,
        setOnlineUsers,
        profile,
        setProfile,
        requestData,
        updateRequestData,
        hasToken,
        setHasToken,
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}

export default App;
