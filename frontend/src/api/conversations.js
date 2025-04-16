const fetchConversations = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return res.json();
};

const fetchCurrentConversation = async (conversationId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/conversations/${conversationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return res.json();
};

const deleteConversation = async (conversationId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/conversations/${conversationId}`,
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

export { fetchConversations, fetchCurrentConversation, deleteConversation };
