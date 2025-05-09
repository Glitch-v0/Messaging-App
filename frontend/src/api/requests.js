const fetchRequests = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

const acceptRequest = async (requestId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/accept`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  const data = await res.json();
  return data;
};

const rejectFriendRequest = async (requestId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/reject`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  const data = await res.json();
  return data;
};

const cancelRequest = async (requestId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/cancel`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  const data = await res.json();
  return data;
};

export { fetchRequests, acceptRequest, rejectFriendRequest, cancelRequest };
