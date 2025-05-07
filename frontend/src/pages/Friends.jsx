import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "../components/Spinner.jsx";
import Error from "./Error.jsx";
import { friendsAPI } from "../api/friends.js";

const Friends = () => {
  const client = useQueryClient();
  const { isPending, isPaused, isError, data, refetch } = useQuery({
    queryKey: ["friends"],
    queryFn: friendsAPI.fetchFriendsPage,
    staleTime: 1000 * 5 * 1,
  });

  const removeFriendMutation = useMutation({
    mutationFn: (id) => friendsAPI.removeFriend(id),
    onSuccess: (response) => {
      client.setQueryData(["friends"], (old) => {
        console.log({ response });
        toast.success("Friend removed");
        return {
          ...old,
          friends: old.friends.filter((friend) => friend.id !== response.id),
        };
      });
    },
    onError: (error) => {
      toast.error("Error removing friend");
      console.error({ error });
    },
  });

  const blockFriendMutation = useMutation({
    mutationFn: (id) => friendsAPI.blockFriend(id),
    onSuccess: (response) => {
      console.log(`Blocking friend and displaying data....`);
      console.log({ response });

      const blockedFriend = data.friends.find(
        (friend) => friend.id === response.blockedId
      );

      if (!blockedFriend) {
        toast.error("Blocked friend not found in current cache");
        refetch();
        return;
      }

      // filter out the blocked friend
      client.setQueryData(["friends"], (old) => {
        toast.success("Friend blocked");
        return {
          ...old,
          friends: old.friends.filter(
            (friend) => friend.id !== response.blockedId
          ),
          blocked: [...old.blocked, blockedFriend],
        };
      });
    },
    onError: (error) => {
      toast.error("Error blocking friend");
      console.error({ error });
    },
  });

  const unblockFriendMutation = useMutation({
    mutationFn: (id) => friendsAPI.unblockFriend(id),
    onSuccess: (response) => {
      client.setQueryData(["friends"], (old) => {
        toast.success("Friend unblocked");
        return {
          ...old,
          blocked: old.blocked.filter((friend) => friend.id !== response.id),
        };
      });
    },
    onError: (error) => {
      toast.error("Error unblocking friend");
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
    <main id="friendsPage">
      <h1>You currently have no friends.</h1>
    </main>
  ) : (
    <main id="friendsPage">
      <h1>Friends</h1>
      <ul className="friendContainer">
        {data.friends.map((friend) => (
          <div key={friend.id} className="friend">
            <li>{friend.name}</li>
            <button onClick={() => removeFriendMutation.mutate(friend.id)}>
              Unfriend
            </button>
            <button onClick={() => blockFriendMutation.mutate(friend.id)}>
              Block
            </button>
          </div>
        ))}
      </ul>

      <h1>Blocked</h1>
      <ul className="friendContainer">
        {data?.blocked?.map((friend) => (
          <div key={friend.id} className="blocked">
            <li>
              {friend.name.length > 18
                ? `${friend.name.slice(0, 9)}...${friend.name.slice(-6)}`
                : friend.name}
            </li>
            <button onClick={() => unblockFriendMutation.mutate(friend.id)}>
              Unblock
            </button>
          </div>
        ))}
      </ul>
    </main>
  );
};

export default Friends;
