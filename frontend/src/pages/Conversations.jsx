import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../components/Spinner.jsx";
import MessageContainer from "../components/MessageContainer.jsx";
import IconContainer from "../components/IconContainer.jsx";
import ReactionContainer from "../components/ReactionContainer.jsx";
import NewConversation from "../components/NewConversation.jsx";
import { toast } from "sonner";
import Error from "./Error.jsx";
import { ConversationContext } from "../context.jsx";
import {
  fetchConversationsPage,
  fetchCurrentConversation,
  deleteConversation,
  createConversation,
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

  const numberOfParticipantsToDisplay = 3;

  const getAllConversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const loadPage = await fetchConversationsPage();
      setCurrentConversation(loadPage?.conversations[0]?.id);
      return loadPage;
    },
    staleTime: 1000 * 60 * 0.5,
  });

  const getSingleConversationQuery = useQuery({
    queryKey: ["currentConversation", currentConversation],
    queryFn: () => fetchCurrentConversation(currentConversation),
    enabled: !!currentConversation,
    staleTime: 1000 * 60 * 0.5,
  });

  const newConversationMutation = useMutation({
    mutationFn: ({ participants, message }) =>
      createConversation(participants, message),
    onSuccess: (response) => {
      //Steps for existing convo
      if (response?.content) {
        toast.success("Conversation already exists. Message sent.");
        setCurrentConversation(response.conversation.id);
        client.setQueryData(["currentConversation", response.conversation.id], {
          ...response.conversation,
          messages: [...response.conversation.messages, response.content],
        });
      } else {
        //Steps for new convo
        client.setQueryData(["conversations"], (old) => {
          return {
            ...old,
            conversations: [...old.conversations, response],
          };
        });
        setCurrentConversation(response.id);
        toast.success("Conversation created");
        //scroll to current conversation after delay
        setTimeout(() => {
          const convoButton = document.querySelector(`#${response.id}`);
          const conversationLists =
            document.querySelector("#conversationLists");
          conversationLists.scrollTo(convoButton.offsetLeft, 0);
        }, 1000);
      }
    },
    onError: (error) => {
      toast.error("Error creating conversation");
      console.error({ error });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: () => deleteConversation(currentConversation),
    onSuccess: (response) => {
      setCurrentConversation(null);
      // This order matters for some reason. Calling removeQueries first causes an error
      client.setQueryData(["conversations"], (old) => {
        return {
          ...old,
          conversations: old.conversations.filter(
            (conversation) => conversation.id !== response.id
          ),
        };
      });
      client.removeQueries({
        queryKey: ["currentConversation", response.id],
        exact: true,
      });
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

  return getAllConversationsQuery.data.conversations.length === 0 ? (
    <main id="conversationsPage">
      <div id="conversationLists">
        <h1>You have no conversations</h1>
        <span>You should start one!</span>
        <NewConversation
          friends={getAllConversationsQuery.data.friends.friends}
          newConversationMutation={newConversationMutation}
          anyConversations={false}
        />
      </div>
    </main>
  ) : (
    <main id="conversationsPage">
      <div id="conversationLists">
        <NewConversation
          friends={getAllConversationsQuery.data.friends.friends}
          newConversationMutation={newConversationMutation}
          anyConversations={true}
        />
        {getAllConversationsQuery.data.conversations.map((conversation) => (
          <button
            id={conversation.id}
            key={conversation.id}
            onClick={() => {
              setCurrentConversation(conversation.id);
              setTimeout(() => {
                const container = document.querySelector("#messageContainer");
                if (container) {
                  container.scrollTop = container.scrollHeight;
                }
              }, 100);
            }}
            className={
              currentConversation === conversation.id
                ? "selectedConversation"
                : ""
            }
          >
            <ul>
              <div className="conversationParticipantsContainer">
                {conversation.participants.length >
                numberOfParticipantsToDisplay
                  ? [
                      // Limit number of participants shown
                      ...conversation.participants
                        .slice(0, numberOfParticipantsToDisplay)
                        .map((participant) => (
                          <li key={participant.name} title={participant.name}>
                            <b>
                              {" "}
                              {participant.name.length > 15
                                ? `${participant.name.slice(0, 9)}...${participant.name.slice(-6)}`
                                : participant.name}
                            </b>
                          </li>
                        )),
                      <li key="others">
                        <sub>
                          {`and ${
                            conversation.participants.length -
                            numberOfParticipantsToDisplay
                          } ${conversation.participants.length > 2 ? "others" : "other"}`}
                        </sub>
                      </li>,
                    ]
                  : // Or show all participants
                    conversation.participants.map((participant) => (
                      <li key={participant.name}>
                        <b>
                          {participant.name.length > 14
                            ? `${participant.name.slice(0, 7)}...${participant.name.slice(-6)}`
                            : participant.name}
                        </b>
                      </li>
                    ))}
              </div>
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
      <div id="currentConversation">
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
        {currentConversation && (
          <div id="messageInputContainer">
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
        )}
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
