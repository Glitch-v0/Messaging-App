import { useContext, useEffect } from "react";
import { AppContext } from "../src/context.jsx";

const Friends = () => {
  const { friendsData, updateFriendsData } = useContext(AppContext);

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
  }, [updateFriendsData]);
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
