import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppContext } from "./context.jsx";
import routes from "./routes.jsx";

const router = createBrowserRouter(routes);

function App() {
  const [conversationData, updateConversationData] = useState(null);
  const [friendsData, updateFriendsData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [profile, setProfile] = useState(null);
  const [requestData, updateRequestData] = useState(null);

  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/whoami`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setHasToken(data.authenticated); // Update based on backend response
        setProfile(data.user || null);
      })
      .catch(() => setHasToken(false));
  }, []);

  return (
    <AppContext.Provider
      value={{
        conversationData,
        updateConversationData,
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
