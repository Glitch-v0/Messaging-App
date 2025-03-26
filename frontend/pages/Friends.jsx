import { useState, useEffect } from "react";

const Friends = () => {
  const [friendsData, updateFriendsData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        updateFriendsData(data);
        console.log(data);
      });
  }, []);
  return !friendsData ? (
    <main>
      <h1>You currently have no friends.</h1>
    </main>
  ) : (
    <main>
      <h1>Friends</h1>
    </main>
  );
};

export default Friends;
