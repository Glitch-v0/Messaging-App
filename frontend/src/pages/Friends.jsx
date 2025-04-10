import { useContext, useEffect } from "react";
import { AppContext } from "../context.jsx";
import { toast } from "sonner";

const Friends = () => {
  const { friendsData, updateFriendsData } = useContext(AppContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        updateFriendsData(data);
        console.log(data);
      })
      .catch((err) => toast.error(err.message));
  }, [updateFriendsData]);
  return !friendsData ? (
    <main>
      <h1>Loading...</h1>
    </main>
  ) : friendsData.length === 0 ? (
    <main>
      <h1>You currently have no friends.</h1>
    </main>
  ) : (
    <main>
      <h1>Friends</h1>
      <ul>
        {friendsData.friends.map((friend) => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ul>
    </main>
  );
};

export default Friends;
