import propTypes from "prop-types";
import { toast } from "sonner";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import { useContext } from "react";
import { ConversationContext } from "../context.jsx";

const MessageContainer = () => {
  const {
    getSingleConversationQuery,
    currentMessage,
    setCurrentMessage,
    setMessageEditingMode,
  } = useContext(ConversationContext);

  const handleMoreButton = (e) => {
    // create vertical icon container
    const button = e.target;
    const buttonRect = button.getBoundingClientRect();
    console.log({ buttonRect });

    const iconContainer = document.getElementById("iconContainer");
    iconContainer.style.display = "flex";
    const iconContainerHeight = iconContainer.offsetHeight;
    const iconContainerWidth = iconContainer.offsetWidth;
    iconContainer.style.zIndex = "2";

    // Check top position
    if (buttonRect.y < 50) {
      console.log("Less than 50!");
      iconContainer.style.top = "1rem";
      console.log({ iconContainer });
    } else {
      iconContainer.style.top =
        buttonRect.top - iconContainerHeight * 0.5 + "px";
    }
    // iconContainer.style.top = buttonRect.top - iconContainerHeight * 0.5 + "px";
    iconContainer.style.left =
      buttonRect.left - iconContainerWidth * 0.25 + "px";
    iconContainer.focus();

    setCurrentMessage(currentMessage);
    setMessageEditingMode(false);
  };

  if (getSingleConversationQuery.isPaused) {
    return toast.error("Looks like you are offline. Check your internet");
  }

  if (getSingleConversationQuery.isLoading) {
    return (
      <div id="messageContainer">
        <Spinner />
      </div>
    );
  }

  if (getSingleConversationQuery.isError) {
    return (
      <div id="messageContainer">
        {getSingleConversationQuery.error.message}
      </div>
    );
  }

  return (
    <div id="messageContainer">
      {getSingleConversationQuery?.data?.messages
        ? getSingleConversationQuery.data.messages.map((message) => (
            <Message key={message.id} {...{ message, handleMoreButton }} />
          ))
        : null}
    </div>
  );
};

MessageContainer.propTypes = {
  getSingleConversationQuery: propTypes.object,
  currentMessage: propTypes.string,
  handleSubmitEdit: propTypes.func,
};
export default MessageContainer;
