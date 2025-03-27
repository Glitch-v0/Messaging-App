import { useState, useEffect } from "react";
import { formatRelativeTime } from "../utils/time.js";

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
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody className="onlineUsers">
          {onlineUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{formatRelativeTime(user.lastSeen)}</td>
              <td>
                <button>Add Friend</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Online;
