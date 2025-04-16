import { useQuery } from "@tanstack/react-query";
import { formatRelativeTime } from "../utils/time.js";
import { toast } from "sonner";
import Spinner from "../components/Spinner.jsx";
import Error from "./Error.jsx";

const fetchRequests = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

const Requests = () => {
  const { isPending, isPaused, isError, data, error, refetch } = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
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
      <h1>You currently have no friend requests!</h1>
    </main>
  ) : (
    <main>
      <h1>Received Requests:</h1>
      {data.map((request) => (
        <div key={request.id} className="requestContainer">
          <p>{request.sender.name}</p>
          <p>{formatRelativeTime(request.dateSent)}</p>
          <div className="requestButtons">
            <button>Accept</button>
            <button>Decline</button>
          </div>
        </div>
      ))}
      <h2>Sent Requests:</h2>
    </main>
  );
};

export default Requests;
