import { useContext, useEffect } from "react";
import { AppContext } from "../src/context.jsx";

const Requests = () => {
  const { requestData, updateRequestData } = useContext(AppContext);

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
  }, [updateRequestData]);
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
