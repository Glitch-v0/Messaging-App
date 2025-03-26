import { useState, useEffect } from "react";

const Requests = () => {
  const [requestData, updateRequestData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        updateRequestData(data);
        console.log(data);
      });
  }, []);
  return requestData.length === 0 ? (
    <main>
      <h1>You currently have no friend requests!</h1>
    </main>
  ) : (
    <main>
      <h1>Requests</h1>
      <p>{JSON.stringify(requestData)}</p>
    </main>
  );
};

export default Requests;
