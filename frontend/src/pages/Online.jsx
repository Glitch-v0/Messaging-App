import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendsAPI } from "../api/friends.js";
import { formatRelativeTime } from "../utils/time.js";
import { toast } from "sonner";
import Spinner from "../components/Spinner.jsx";
import Error from "./Error.jsx";
import { Link } from "react-router-dom";

const Online = () => {
  const client = useQueryClient();
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

  const addFriendMutation = useMutation({
    mutationFn: (friendId) => friendsAPI.addFriend(friendId),
    onSuccess: (response) => {
      const userToUpdate = response?.receiverId;
      client.setQueryData(["online"], (old) => {
        //find old data with that user
        return old.map((user) => {
          if (user.id === userToUpdate) {
            return {
              ...user,
              sentRequests: true,
            };
          }
          return user;
        });
      });
      client.invalidateQueries(["requests"]);
      toast.success("Friend request sent");
    },
    onError: () => {
      toast.error("Error sending friend request");
    },
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
            <th className="lastSeen">Last Seen</th>
            <th>Status</th>
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
                <td className="lastSeen">
                  {formatRelativeTime(user.lastSeen)}
                </td>
                <td>
                  {/*Checks for pending request */}
                  {user.receivedRequests || user.sentRequests ? (
                    <Link className="status cautionButton" to="/requests">
                      Pending
                    </Link>
                  ) : /*Checks if already friend or is user */
                  !user.friends && !user?.isUser ? (
                    <button
                      className="status"
                      onClick={() => addFriendMutation.mutate(user.id)}
                    >
                      Add Friend
                    </button>
                  ) : user.friends ? (
                    <Link className="status positiveButton" to="/friends">
                      Friend
                    </Link>
                  ) : user?.isUser ? (
                    <Link className="status youButton" to="/profile">
                      You
                    </Link>
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
