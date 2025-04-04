import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context.jsx";
import Message from "../components/Message.jsx";

const Conversations = () => {
  const {
    conversationData,
    updateConversationData,
    currentConversation,
    setCurrentConversation,
  } = useContext(AppContext);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [iconContainerZIndex, setIconContainerZIndex] = useState(-2);
  const [messageEditingMode, setMessageEditingMode] = useState(false);

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

  const handleSendMessage = (conversationId) => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: document.getElementById("messageInput").value,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setCurrentConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, { ...data, owner: true }],
          }));
          document.getElementById("messageInput").value = "";
          setTimeout(() => {
            console.log({ data });
            const container = document.querySelector(".messageContainer");
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          }, 100); // delay for layout to update
        }
      });
  };

  const handleMoreButton = (e) => {
    // create vertical icon container
    const button = e.target;
    const buttonRect = button.getBoundingClientRect();

    let parent = button.parentElement.parentElement;
    console.log(`Button clicked: ${button}, Current parent ID: ${parent.id}`);
    if (parent.id === null) {
      parent = button.parentElement.parentElement;
      console.log(`Id not found: changing to parent ID: ${parent.id}`);
    }
    console.log(
      `Clicked more button ${button}, belonging to message ${parent}`
    );

    //Check if current message is already set
    if (currentMessage !== parent.id) {
      console.log("Not the same message! Updating");
      setCurrentMessage(parent.id);
      setMessageEditingMode(false);
    }

    const iconContainer = document.getElementById("iconContainer");
    const iconContainerHeight = iconContainer.offsetHeight;
    const iconContainerWidth = iconContainer.offsetWidth;
    setIconContainerZIndex(2);
    iconContainer.style.top = buttonRect.top - iconContainerHeight * 0.5 + "px";
    iconContainer.style.left =
      buttonRect.left - iconContainerWidth * 0.25 + "px";
  };

  const handleReactButton = () => {
    console.log(`Clicked react button! Sending message ID: ${currentMessage}`);
    // fetch(
    //   `${import.meta.env.VITE_BACKEND_URL}/conversations/${
    //     currentConversation.id
    //   }/messages/${currentMessage}/reaction`,
    //   {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include",
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data) {
    //       console.log(data);
    //     }
    //   });
  };

  const handleDeleteButton = () => {
    console.log("Clicked delete button!");
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/conversations/${
        currentConversation.id
      }/messages/${currentMessage}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log(data);
          setCurrentConversation((prev) => ({
            ...prev,
            messages: prev.messages.filter((message) => message.id !== data.id),
          }));
          setIconContainerZIndex(-2);
        }
      });
  };

  const handleEditButton = () => {
    console.log("Clicked edit button!");
    setMessageEditingMode(!messageEditingMode);
    setIconContainerZIndex(-2);
    if (messageEditingMode === false) {
      setTimeout(() => {
        console.log(`Message editing omode: ${messageEditingMode}`);
        const form = document.getElementById(currentMessage);
        const input = form.getElementsByTagName("input")[0];
        console.log({ form, input });
        input.focus();
      }, 150);
    }
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/conversations/${
        currentConversation.id
      }/messages/${currentMessage}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: e.target.message.value,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log(data);
          setCurrentConversation((prev) => ({
            ...prev,
            messages: prev.messages.map((message) =>
              message.id === currentMessage
                ? { ...message, content: data.content } // Update with the new content
                : message
            ),
          }));
          setMessageEditingMode(false);
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
        const iconContainer = document.getElementById("iconContainer");
        iconContainer.addEventListener("mouseleave", () => {
          setIconContainerZIndex(-2);
        });
      });
  }, [updateConversationData]);

  return (
    <main className="conversationContainer">
      {!conversationData ? (
        <h1>Loading...</h1>
      ) : conversationData.length === 0 ? (
        <>
          <h1>No conversations</h1>
          <p>You should start one!</p>
        </>
      ) : (
        <>
          <div className="conversationLists">
            <h1>Conversations</h1>
            {conversationData.map((conversation) => (
              <Link
                key={conversation.id}
                onClick={() => handleLoadConversation(conversation.id)}
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
            <div className="messageContainer">
              {currentConversation &&
                currentConversation.messages.map((message) => (
                  <Message
                    key={message.id}
                    messageEditing={
                      messageEditingMode && message.id === currentMessage
                    }
                    message={message}
                    handleMoreButton={handleMoreButton}
                    handleSubmitEdit={handleSubmitEdit}
                    currentMessage={currentMessage}
                  />
                ))}
            </div>

            <div className="messageInputContainer">
              <form
                action=""
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(currentConversation.id);
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
        </>
      )}
      <div id="iconContainer" style={{ zIndex: iconContainerZIndex }}>
        <svg
          className="messageIcon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          id="reactToMessageIcon"
          onClick={(e) => handleReactButton(e)}
        >
          <path
            fill="currentColor"
            d="M20 7V5h-2V3h2V1h2v2h2v2h-2v2zm-4.5 4q.625 0 1.063-.437T17 9.5t-.437-1.062T15.5 8t-1.062.438T14 9.5t.438 1.063T15.5 11m-7 0q.625 0 1.063-.437T10 9.5t-.437-1.062T8.5 8t-1.062.438T7 9.5t.438 1.063T8.5 11m3.5 6.5q1.7 0 3.088-.962T17.1 14H6.9q.625 1.575 2.013 2.538T12 17.5m0 4.5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2q1.075 0 2.075.213T16 2.825V7h2v2h3.55q.225.725.338 1.463T22 12q0 2.075-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
          />
        </svg>
        <svg
          className="messageIcon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          id="deleteMessageIcon"
          onClick={handleDeleteButton}
        >
          <path
            fill="currentColor"
            d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
          />
        </svg>
        <svg
          className="messageIcon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          id="editMessageIcon"
          onClick={() => handleEditButton()}
        >
          <path
            fill="currentColor"
            d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
          />
        </svg>
      </div>
    </main>
  );
};

export default Conversations;
