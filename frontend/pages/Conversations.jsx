import { useEffect, useContext } from "react";
import { AppContext } from "../src/context.jsx";

const Conversations = () => {
  const { conversationData, updateConversationData } = useContext(AppContext);

  useEffect(() => {
    //load messages
    fetch(`${import.meta.env.VITE_BACKEND_URL}/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        updateConversationData(data);
        console.log(data);
      });
  }, [updateConversationData]);

  return conversationData.length === 0 ? (
    <main>
      <h1>No conversations</h1>
      <p>You should start one!</p>
    </main>
  ) : (
    <main>
      <h1>Conversations</h1>
      <p>{JSON.stringify(conversationData)}</p>
    </main>
  );
};

export default Conversations;
