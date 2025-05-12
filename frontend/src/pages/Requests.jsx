import { useQuery, useMutation } from "@tanstack/react-query";
import { formatRelativeTime } from "../utils/time.js";
import { toast } from "sonner";
import Spinner from "../components/Spinner.jsx";
import Error from "./Error.jsx";
import {
  fetchRequests,
  acceptRequest,
  rejectFriendRequest,
  cancelRequest,
} from "../api/requests.js";

const Requests = () => {
  const { isPending, isPaused, isError, data, refetch } = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
    staleTime: 1000 * 60 * 1,
  });

  const acceptRequestMutation = useMutation({
    mutationFn: acceptRequest,
    onSuccess: () => {
      toast.success("Friend request accepted!");
      refetch();
    },
    onError: (error) => {
      toast.error("Error accepting friend request");
      console.error({ error });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast.success("Friend request rejected!");
      refetch();
    },
    onError: (error) => {
      toast.error("Error rejecting friend request");
      console.error({ error });
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: cancelRequest,
    onSuccess: () => {
      toast.success("Friend request canceled!");
      refetch();
    },
    onError: (error) => {
      toast.error("Error canceling friend request");
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

  return data.length === 0 ? (
    <main id="requestsPage">
      <h1>You currently have no friend requests!</h1>
    </main>
  ) : (
    <main id="requestsPage">
      <h1>Received Requests:</h1>
      {data.map(
        (request) =>
          !request.fromUser && (
            <div key={request.id} className="requestContainer">
              <p>
                <b>
                  {" "}
                  {request.sender.name.length > 18
                    ? `${request.sender.name.slice(0, 9)}...${request.sender.name.slice(-6)}`
                    : request.sender.name}
                </b>
              </p>
              <p>{formatRelativeTime(request.dateSent)}</p>
              <div className="requestButtons">
                <button
                  onClick={() => acceptRequestMutation.mutate(request.id)}
                  className="positiveButton"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequestMutation.mutate(request.id)}
                  className="negativeButton"
                >
                  Decline
                </button>
              </div>
            </div>
          )
      )}
      <h1>Sent Requests:</h1>
      {data.map(
        (request) =>
          request.fromUser && (
            <div key={request.id} className="requestContainer">
              <p title={request.receiver.name}>
                <b>
                  {" "}
                  {request.receiver.name.length > 18
                    ? `${request.receiver.name.slice(0, 9)}...${request.receiver.name.slice(-6)}`
                    : request.receiver.name}
                </b>
              </p>
              <p className="dateSent">{formatRelativeTime(request.dateSent)}</p>
              <button
                className="requestButtons negativeButton"
                onClick={() => cancelRequestMutation.mutate(request.id)}
              >
                Cancel
              </button>
            </div>
          )
      )}
    </main>
  );
};

export default Requests;
