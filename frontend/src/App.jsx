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
    setHasToken(!!localStorage.getItem("token")); // Convert to boolean
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
