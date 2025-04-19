import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "../components/Spinner.jsx";
import Error from "./Error.jsx";
import { friendsAPI } from "../api/friends.js";

const Friends = () => {
  const client = useQueryClient();

  const { isPending, isPaused, isError, data } = useQuery({
    queryKey: ["friends"],
    queryFn: friendsAPI.getFriends,
    staleTime: 1000 * 60 * 1,
  });

  const removeFriendMutation = useMutation({
    mutationFn: ({ fn, id }) => {
      return fn(id);
    },
    onSuccess: () => {
      client.fetchQuery(["friends"]);
      toast.success("Friend removed");
    },
    onError: (error) => {
      toast.error("Error removing friend");
      console.error({ error });
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

  return data?.length === 0 ? (
    <main>
      <h1>You currently have no friends.</h1>
    </main>
  ) : (
    <main>
      <h1>Friends</h1>
      <ul className="friendContainer">
        {data.friends.map((friend) => (
          <div key={friend.id} className="friend">
            <li>{friend.name}</li>
            <button
              onClick={() =>
                removeFriendMutation.mutate({
                  fn: friendsAPI.removeFriend,
                  id: friend.id,
                })
              }
            >
              Unfriend
            </button>
            <button
              onClick={() =>
                removeFriendMutation.mutate({
                  fn: friendsAPI.blockFriend,
                  id: friend.id,
                })
              }
            >
              Block
            </button>
          </div>
        ))}
      </ul>
    </main>
  );
};

export default Friends;
