import { useQuery } from "@tanstack/react-query";
import { formatRelativeTime } from "../utils/time.js";
import { toast } from "sonner";
import Spinner from "../components/Spinner.jsx";
import Error from "./Error.jsx";

const Online = () => {
  const { isPending, isPaused, isError, data, error, refetch } = useQuery({
    queryKey: ["online"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/online`, {
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

  return (
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
          {data.map((user) => (
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
