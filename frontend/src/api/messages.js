const deleteMessage = async (conversationId, messageId) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/conversations/${conversationId}/messages/${messageId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return res.json();
};

const editMessage = async (conversationId, messageId, message) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/conversations/${conversationId}/messages/${messageId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ message }),
    }
  );
  return res.json();
};

const sendMessage = async (conversationId, message) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ message }),
    }
  );
  return res.json();
};

const reactMessage = async (conversationId, messageId, emoji) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/conversations/${conversationId}/messages/${messageId}/reaction`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ reactionType: emoji }),
    }
  );
  return res.json();
};

export { deleteMessage, editMessage, sendMessage, reactMessage };
