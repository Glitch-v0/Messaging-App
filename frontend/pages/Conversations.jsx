import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../src/context.jsx";
import { formatRelativeTime } from "../utils/time.js";

const Conversations = () => {
  const {
    conversationData,
    updateConversationData,
    currentConversation,
    setCurrentConversation,
  } = useContext(AppContext);

  const handleLoadConversation = (conversationId) => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/conversations/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setCurrentConversation(data);
          console.log(data);
        }
      });
  };

  useEffect(() => {
    //load messages
    fetch(`${import.meta.env.VITE_BACKEND_URL}/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
    <main className="conversationContainer">
      <div className="conversationLists">
        <h1>Conversations</h1>
        {conversationData.map((conversation) => (
          // List of participants
          <Link
            key={conversation.id}
            onClick={() => handleLoadConversation(conversation.id)}
          >
            <ul>
              {conversation.participants.map((participant) => (
                <li key={participant.name}>{participant.name}</li>
              ))}
              <p>{conversation.messages[0].content.substring(0, 10)}</p>
            </ul>
          </Link>
          // Message
        ))}
      </div>
      <div className="currentConversation">
        <div className="messageContainer">
          {currentConversation &&
            currentConversation.messages.map((message) => (
              <p
                key={message.id}
                className={
                  message.senderId === currentConversation.owner
                    ? "messageFromOwner"
                    : "messageFromOther"
                }
              >
                {message.content}
                <sub>{formatRelativeTime(message.timestamp)}</sub>
              </p>
            ))}
        </div>
        <input type="text" placeholder="Type your message" />
      </div>
    </main>
  );
};

export default Conversations;
