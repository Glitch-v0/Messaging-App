import { useQuery, useMutation } from "@tanstack/react-query";
import { friendsAPI } from "../api/friends.js";
import { formatRelativeTime } from "../utils/time.js";
import { toast } from "sonner";
import Spinner from "../components/Spinner.jsx";
import Error from "./Error.jsx";

const handleAddFriend = (e, id) => {
  friendsAPI
    .addFriend(id)
    .then(() => {
      toast.success("Friend request sent");
      e.target.disabled = true;
    })
    .catch(() => {
      toast.error("Error sending friend request");
    });
};

const Online = () => {
  const { isPending, isPaused, isError, data } = useQuery({
    queryKey: ["online"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/online`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).then((res) => res.json()),
    staleTime: 1000 * 5 * 1,
  });

  if (isPaused)
    toast.error("Looks like you are offline. Check your internet connection");

  if (isPending) {
    return (
      <main>
        <Spinner />
      </main>
    );
  }

  if (isError) {
    return <Error />;
  }

  return (
    <main id="onlinePage">
      <h1>Online</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody className="onlineUsers">
          {data.length === 0 ? (
            <tr>No users online</tr>
          ) : (
            data.length > 0 &&
            data.map((user) => (
              <tr key={user.id}>
                <td title={user.name}>
                  {user.name.length > 18
                    ? `${user.name.slice(0, 9)}...${user.name.slice(-6)}`
                    : user.name}
                </td>
                <td>{formatRelativeTime(user.lastSeen)}</td>
                <td>
                  {/*Checks for pending request */}
                  {user.receivedRequests || user.sentRequests ? (
                    <button
                      onClick={(e) => handleAddFriend(e, user.id)}
                      disabled
                    >
                      Friend Request Pending
                    </button>
                  ) : /*Checks if already friend or is user */
                  !user.friends && !user?.isUser ? (
                    <button onClick={(e) => handleAddFriend(e, user.id)}>
                      Add Friend
                    </button>
                  ) : user.friends ? (
                    <p>Friend</p>
                  ) : user?.isUser ? (
                    <p>You</p>
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default Online;
