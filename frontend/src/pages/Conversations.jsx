import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../components/Spinner.jsx";
import MessageContainer from "../components/MessageContainer.jsx";
import IconContainer from "../components/IconContainer.jsx";
import ReactionContainer from "../components/ReactionContainer.jsx";
import { toast } from "sonner";
import Error from "./Error.jsx";
import { ConversationContext } from "../context.jsx";
import {
  fetchConversations,
  fetchCurrentConversation,
  deleteConversation,
} from "../api/conversations.js";
import {
  deleteMessage,
  editMessage,
  sendMessage,
  reactMessage,
  removeMessageReaction,
} from "../api/messages.js";

const handleReactButton = async (e) => {
  console.log({ e });
  const messageRect = e.target.getBoundingClientRect();
  const reactionContainer = document.querySelector("#reactionContainer");
  reactionContainer.style.display = "flex";
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

  reactionContainer.focus();

  console.log({ messageRect, reactionContainer });
};

const Conversations = () => {
  const client = useQueryClient();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [currentMessage, setCurrentMessage] = useState({});
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

  const deleteConversationMutation = useMutation({
    mutationFn: () => deleteConversation(currentConversation),
    onSuccess: () => {
      client.invalidateQueries(["conversations"]);
      setCurrentConversation(null);
      toast.success("Conversation deleted");
    },
    onError: (error) => {
      toast.error("Error deleting conversation");
      console.error({ error });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: () => deleteMessage(currentConversation, currentMessage.id),
    onSuccess: () => {
      // client.invalidateQueries(["currentConversation", currentConversation]);
      client.setQueryData(
        ["currentConversation", currentConversation],
        (old) => {
          console.log({ old });
          return {
            ...old,
            messages: old.messages.filter(
              (message) => message.id !== currentMessage.id
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
      editMessage(currentConversation, currentMessage.id, message),
    onSuccess: (updatedMessage) => {
      client.setQueryData(
        ["currentConversation", currentConversation],
        (old) => {
          if (!old) return old;
          setCurrentMessage({});
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

  const reactMessageMutation = useMutation({
    mutationFn: (emoji) => {
      // Check if user already has this reaction
      const hasReaction =
        currentMessage.owner &&
        currentMessage.reactions.some(
          (reaction) =>
            reaction.userId === currentMessage.sender.id &&
            reaction.type === emoji
        );

      // If user already has this reaction, remove it; otherwise, add it
      if (hasReaction) {
        return removeMessageReaction(currentConversation, currentMessage.id);
      } else {
        return reactMessage(currentConversation, currentMessage.id, emoji);
      }
    },
    onSuccess: (newReaction) => {
      //update messages to set new reaction to currentMessage
      client.setQueryData(
        ["currentConversation", currentConversation],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: old.messages.map((message) => {
              if (message.id !== currentMessage.id) return message;

              if (newReaction.isRemoval) {
                // Remove user reaction
                return {
                  ...message,
                  reactions: message.reactions.filter(
                    (reaction) => reaction.userId !== currentMessage.sender.id
                  ),
                };
              } else {
                // Add/replace user reaction
                const filteredReactions = message.reactions.filter(
                  (reaction) => reaction.userId !== newReaction.userId
                );
                return {
                  ...message,
                  reactions: [...filteredReactions, newReaction],
                };
              }
            }),
          };
        }
      );

      // toast.success("Message reacted!" + newReaction.type);
    },
    onError: (error) => {
      toast.error("Error reacting to message");
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
    return <Error />;
  }

  return getAllConversationsQuery.data.length === 0 ? (
    <main>
      <h1>You currently have no conversations.</h1>
      <p>You should start one.</p>
    </main>
  ) : (
    <main id="conversationContainer">
      <div className="conversationLists">
        <h1>Conversations</h1>
        {getAllConversationsQuery.data.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => setCurrentConversation(conversation.id)}
          >
            <ul>
              {conversation.participants.map((participant) => (
                <li key={participant.name}>{participant.name}</li>
              ))}
              <p>
                &quot;{conversation.messages[0].content.substring(0, 10)}
                ...&quot;
              </p>
              <svg
                className="conversationIcon deleteConversationIcon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                onClick={() =>
                  deleteConversationMutation.mutate(conversation.id)
                }
              >
                <path
                  fill="currentColor"
                  d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
                />
              </svg>
            </ul>
          </button>
        ))}
      </div>
      <div className="currentConversation">
        <ConversationContext.Provider
          value={{
            getSingleConversationQuery,
            currentMessage,
            setCurrentMessage,
            messageEditingMode,
            setMessageEditingMode,
            editMessageMutation,
            handleReactButton,
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

      <ReactionContainer {...{ reactMessageMutation, currentMessage }} />
    </main>
  );
};

export default Conversations;
