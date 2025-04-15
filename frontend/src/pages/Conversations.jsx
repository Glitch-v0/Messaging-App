import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import MessageContainer from "../components/MessageContainer.jsx";
import IconContainer from "../components/IconContainer.jsx";
import ReactionContainer from "../components/ReactionContainer.jsx";
import { toast } from "sonner";
import Error from "./Error.jsx";
import { ConversationContext } from "../context.jsx";

const fetchConversations = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return res.json();
};

const fetchCurrentConversation = async (conversationId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/conversations/${conversationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return res.json();
};

const deleteMessage = async (conversationId, messageId) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/conversations/${conversationId}/messages/${messageId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return res.json();
};

const editMessage = async (conversationId, messageId, message) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/conversations/${conversationId}/messages/${messageId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ message }),
    }
  );
  return res.json();
};

const sendMessage = async (conversationId, message) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ message }),
    }
  );
  return res.json();
};

const handleReactButton = async (e) => {
  const messageRect = e.target.getBoundingClientRect();
  const reactionContainer = document.querySelector(".reactionContainer");

  reactionContainer.style.zIndex = "4";

  //Bottom set to top of what is clicked
  reactionContainer.style.bottom =
    window.innerHeight - messageRect.top - messageRect.height + "px";

  //Right side set to left side of what is clicked
  reactionContainer.style.right =
    window.innerWidth -
    messageRect.right -
    reactionContainer.style.width +
    "px";

  console.log({ messageRect, reactionContainer });
};

const Conversations = () => {
  const client = useQueryClient();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageEditingMode, setMessageEditingMode] = useState(false);

  const getAllConversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    staleTime: 1000 * 60 * 0.5,
  });

  const getSingleConversationQuery = useQuery({
    queryKey: ["currentConversation", currentConversation],
    queryFn: () => fetchCurrentConversation(currentConversation),
    enabled: !!currentConversation,
    staleTime: 1000 * 60 * 0.5,
  });

  const deleteMessageMutation = useMutation({
    mutationFn: () => deleteMessage(currentConversation, currentMessage),
    onSuccess: () => {
      // client.invalidateQueries(["currentConversation", currentConversation]);
      client.setQueryData(
        ["currentConversation", currentConversation],
        (old) => {
          console.log({ old });
          return {
            ...old,
            messages: old.messages.filter(
              (message) => message.id !== currentMessage
            ),
          };
        }
      );
      toast.success("Message deleted");
    },
    onError: (error) => {
      toast.error("Error deleting message");
      console.error({ error });
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: (message) =>
      editMessage(currentConversation, currentMessage, message),
    onSuccess: (updatedMessage) => {
      client.setQueryData(
        ["currentConversation", currentConversation],
        (old) => {
          if (!old) return old;
          setCurrentMessage("");
          setMessageEditingMode(false);

          return {
            ...old,
            messages: old.messages.map((message) =>
              message.id === updatedMessage.id
                ? { ...message, content: updatedMessage.content }
                : message
            ),
          };
        }
      );
      toast.success("Message edit saved");
    },
    onError: (error) => {
      toast.error("Error editing message");
      console.error({ error });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: () =>
      sendMessage(
        currentConversation,
        document.getElementById("messageInput").value
      ),
    onSuccess: (newMessage) => {
      client.setQueryData(
        ["currentConversation", currentConversation],
        (old) => {
          return {
            ...old,
            messages: [...old.messages, { ...newMessage, owner: true }],
          };
        }
      );
      const input = document.getElementById("messageInput");
      if (input) input.value = "";
      input.disabled = false;

      setTimeout(() => {
        const container = document.querySelector(".messageContainer");
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100); // delay for layout to update

      toast.success("Message sent");
    },
    onError: (error) => {
      toast.error("Error sending message");
      console.error({ error });
    },
  });

  if (getAllConversationsQuery.isPaused) {
    toast.error("Looks like you are offline. Check your internet connection");
  }

  if (getAllConversationsQuery.isPending) {
    return (
      <main>
        <Spinner />
      </main>
    );
  }

  if (getAllConversationsQuery.isError) {
    return (
      <Error
        error={getAllConversationsQuery.isError}
        refetch={fetchConversations}
      />
    );
  }

  return getAllConversationsQuery.data.length === 0 ? (
    <main>
      <h1>You currently have no conversations.</h1>
      <p>You should start one.</p>
    </main>
  ) : (
    <main className="conversationContainer">
      <div className="conversationLists">
        <h1>Conversations</h1>
        {getAllConversationsQuery.data.map((conversation) => (
          <Link
            key={conversation.id}
            onClick={() => setCurrentConversation(conversation.id)}
          >
            <ul>
              {conversation.participants.map((participant) => (
                <li key={participant.name}>{participant.name}</li>
              ))}
              <p>{conversation.messages[0].content.substring(0, 10)}...</p>
            </ul>
          </Link>
        ))}
      </div>
      <div className="currentConversation">
        <ConversationContext.Provider
          value={{
            getSingleConversationQuery,
            currentMessage,
            setCurrentMessage,
            messageEditingMode,
            editMessageMutation,
          }}
        >
          <MessageContainer />
        </ConversationContext.Provider>

        <div className="messageInputContainer">
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              sendMessageMutation.mutate();
            }}
          >
            <input
              id="messageInput"
              type="text"
              placeholder="Type your message"
            />
          </form>
        </div>
      </div>
      <IconContainer
        currentMessage={currentMessage}
        currentConversation={currentConversation}
        deleteMessageMutation={deleteMessageMutation}
        messageEditingMode={messageEditingMode}
        setMessageEditingMode={setMessageEditingMode}
        handleReactButton={handleReactButton}
      />

      <ReactionContainer />
    </main>
  );
};

export default Conversations;
