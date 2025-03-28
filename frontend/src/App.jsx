import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppContext } from "./context.jsx";
import routes from "./routes.jsx";

const router = createBrowserRouter(routes);

function App() {
  const [conversationData, updateConversationData] = useState([]);
  const [friendsData, updateFriendsData] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [profile, setProfile] = useState({
    darkMode: null,
    showOnline: null,
    allowRequests: null,
  });
  const [requestData, updateRequestData] = useState([]);

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
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}

export default App;
