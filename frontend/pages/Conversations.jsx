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

  return !conversationData ? (
    <main>
      <h1>Loading...</h1>
    </main>
  ) : conversationData.length === 0 ? (
    <main>
      <h1>No conversations</h1>
      <p>You should start one!</p>
    </main>
  ) : (
    <main>
      <h1>Conversations</h1>
      {conversationData.map((conversation) => (
        // List of participants
        <a key={conversation.id} href={`/conversations/${conversation.id}`}>
          <ul>
            {conversation.participants.map((participant) => (
              <li key={participant.id}>{participant.name}</li>
            ))}
            <p>{conversation.messages[0].content}</p>
          </ul>
        </a>
        // Message
      ))}
    </main>
  );
};

export default Conversations;
