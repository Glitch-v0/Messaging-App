import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "../components/Spinner.jsx";
import Error from "./Error.jsx";

const Friends = () => {
  const { isPending, isPaused, isError, data, error, refetch } = useQuery({
    queryKey: ["friends"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/friends`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).then((res) => res.json()),
    staleTime: 1000 * 60 * 1,
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
    return <Error error={error} refetch={refetch} />;
  }

  return data.length === 0 ? (
    <main>
      <h1>You currently have no friends.</h1>
    </main>
  ) : (
    <main>
      <h1>Friends</h1>
      <ul>
        {data.friends.map((friend) => (
          <div key={friend.id} className="friend">
            <li>{friend.name}</li>
            <div>
              <button>Start a new conversation</button>
              <button>Unfriend</button>
              <button>Block</button>
            </div>
          </div>
        ))}
      </ul>
    </main>
  );
};

export default Friends;
