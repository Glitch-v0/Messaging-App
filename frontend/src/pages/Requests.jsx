import { useContext, useEffect } from "react";
import { AppContext } from "../context.jsx";
import { formatRelativeTime } from "../utils/time.js";

const Requests = () => {
  const { requestData, updateRequestData } = useContext(AppContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        updateRequestData(data);
        console.log(data);
      });
  }, [updateRequestData]);
  return !requestData ? (
    <main>
      <h1>Loading...</h1>
    </main>
  ) : requestData.length === 0 ? (
    <main>
      <h1>You currently have no friend requests!</h1>
    </main>
  ) : (
    <main>
      <h1>Received Requests:</h1>
      {requestData.map((request) => (
        <div key={request.id} className="requestContainer">
          <p>{request.sender.name}</p>
          <p>{formatRelativeTime(request.dateSent)}</p>
          <button>Accept</button>
          <button>Decline</button>
        </div>
      ))}
      <h2>Sent Requests:</h2>
    </main>
  );
};

export default Requests;
