const friendsAPI = {
  getFriends: async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
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
};

export { friendsAPI };
