import { useState, useEffect } from "react";

const Online = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/online`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOnlineUsers(data);
        console.log(data);
      });
  }, []);

  return !onlineUsers ? (
    <main>
      <h1>Loading...</h1>
    </main>
  ) : (
    <main>
      <h1>Online</h1>
      <p>{JSON.stringify(onlineUsers)}</p>
    </main>
  );
};

export default Online;
