const createConversation = async (participants, message) => {
  const convertedParticipants = participants.map((participant) => {
    return participant.id;
  });
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ participants: convertedParticipants, message }),
  });
  return res.json();
};

const fetchConversationsPage = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/pages/conversations`,
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

export {
  createConversation,
  fetchConversationsPage,
  fetchConversations,
  fetchCurrentConversation,
  deleteConversation,
};
