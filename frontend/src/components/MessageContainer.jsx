import propTypes from "prop-types";
import { toast } from "sonner";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import { useContext } from "react";
import { ConversationContext } from "../context.jsx";

const MessageContainer = () => {
  const {
    getSingleConversationQuery,
    currentMessageId,
    setCurrentMessageId,
    setMessageEditingMode,
  } = useContext(ConversationContext);

  const handleMoreButton = (e) => {
    // create vertical icon container
    const button = e.target;
    const buttonRect = button.getBoundingClientRect();

    // let parent = button.parentElement.parentElement;
    // console.log(`Clicked more button, belonging to message ${parent.id}`);

    const iconContainer = document.getElementById("iconContainer");
    iconContainer.style.display = "flex";
    const iconContainerHeight = iconContainer.offsetHeight;
    const iconContainerWidth = iconContainer.offsetWidth;
    iconContainer.style.zIndex = "2";
    iconContainer.style.top = buttonRect.top - iconContainerHeight * 0.5 + "px";
    iconContainer.style.left =
      buttonRect.left - iconContainerWidth * 0.25 + "px";
    iconContainer.focus();

    console.log(`Setting current message ID to ${currentMessageId}`);
    setCurrentMessageId(currentMessageId);
    setMessageEditingMode(false);
    console.log({ currentMessageId });
  };

  if (getSingleConversationQuery.isPaused) {
    return toast.error("Looks like you are offline. Check your internet");
  }

  if (getSingleConversationQuery.isLoading) {
    return (
      <div className="messageContainer">
        <Spinner />
      </div>
    );
  }

  if (getSingleConversationQuery.isError) {
    return (
      <div className="messageContainer">
        {getSingleConversationQuery.error.message}
      </div>
    );
  }

  return (
    <div className="messageContainer">
      {getSingleConversationQuery?.data?.messages
        ? getSingleConversationQuery.data.messages.map((message) => (
            <Message
              key={message.id}
              {...{ message, handleMoreButton, currentMessageId }}
            />
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
