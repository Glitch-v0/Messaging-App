const friendsAPI = {
  fetchFriendsPage: async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/pages/friends`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    return data;
  },
  getFriends: async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    console.log({ data });
    return data;
  },
  getFriend: async (friendId) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/friends/${friendId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    return data;
  },
  addFriend: async (friendId) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ receiverId: friendId }),
    });
    return res.json();
  },
  removeFriend: async (friendId) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/friends/${friendId}/remove`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return res.json();
  },
  blockFriend: async (friendId) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/friends/${friendId}/block`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return res.json();
  },
  unblockFriend: async (friendId) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/friends/${friendId}/unblock`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return res.json();
  },
};

export { friendsAPI };
