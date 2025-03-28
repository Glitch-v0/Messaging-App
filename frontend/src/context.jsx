import { createContext } from "react";

export const AppContext = createContext({
  conversationData: [],
  updateConversationData: () => {},
  friendsData: [],
  updateFriendsData: () => {},
  onlineUsers: [],
  setOnlineUsers: () => {},
  profile: {
    darkMode: null,
    showOnline: null,
    allowRequests: null,
  },
  setProfile: () => {},
  requestData: [],
  updateRequestData: () => {},
});
