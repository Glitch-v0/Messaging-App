import { formatRelativeTime } from "../utils/time.js";
import { ConversationContext } from "../context.jsx";
import propTypes from "prop-types";
import { useContext } from "react";

const Message = ({ message, handleMoreButton }) => {
  const {
    editMessageMutation,
    handleReactButton,
    currentMessage,
    setCurrentMessage,
    messageEditingMode,
  } = useContext(ConversationContext);

  return messageEditingMode &&
    message.owner &&
    message.id === currentMessage.id ? (
    <form
      className="messageFromOwner"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const message = formData.get("message");
        editMessageMutation.mutate(message);
      }}
      key={message.id}
    >
      <p id={message.id}>
        <input type="text" name="message" defaultValue={message.content} />
        <sub className="messageTimestamp">
          {formatRelativeTime(message.timestamp)}
        </sub>
        <sub className="messageSender">{message.sender.name}</sub>
        {/* Group and display reactions */}
        <span className="messageReactions">
          {Object.entries(
            message.reactions.reduce((acc, reaction) => {
              acc[reaction.type] = (acc[reaction.type] || 0) + 1;
              return acc;
            }, {})
          ).map(([type, count]) => (
            <span key={type} className="messageReactionType">
              <span className="reaction-emoji">{type}</span>
              <span className="reaction-count">{count}</span>
            </span>
          ))}
        </span>

        <button
          type="button"
          onClick={(e) => handleMoreButton(e)}
          aria-haspopup="menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="moreButton"
          >
            <path
              fill="currentColor"
              d="M12 20q-.825 0-1.412-.587T10 18t.588-1.412T12 16t1.413.588T14 18t-.587 1.413T12 20m0-6q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-6q-.825 0-1.412-.587T10 6t.588-1.412T12 4t1.413.588T14 6t-.587 1.413T12 8"
            />
          </svg>
        </button>
      </p>
    </form>
  ) : (
    <>
      <p
        key={message.id}
        id={message.id}
        className={message.owner ? "messageFromOwner" : "messageFromOther"}
      >
        {message.content}
        <sub className="messageTimestamp">
          {formatRelativeTime(message.timestamp)}
        </sub>

        {/* More button available to message owner */}
        <sub className="messageSender" title={message.sender.name}>
          {message.sender.name.length > 15
            ? `${message.sender.name.slice(0, 9)}...${message.sender.name.slice(-6)}`
            : message.sender.name}
        </sub>
        {message.owner ? (
          <button
            onClick={(e) => {
              handleMoreButton(e);
              setCurrentMessage(message);
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="moreButton"
            >
              <path
                fill="currentColor"
                d="M12 20q-.825 0-1.412-.587T10 18t.588-1.412T12 16t1.413.588T14 18t-.587 1.413T12 20m0-6q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-6q-.825 0-1.412-.587T10 6t.588-1.412T12 4t1.413.588T14 6t-.587 1.413T12 8"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={(e) => {
              handleReactButton(e);
              setCurrentMessage(message);
            }}
          >
            {/* React button replaces more button for messages not belonging to owner */}
            <svg
              className="messageIcon messageFromOtherIcon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              id="reactToMessageIcon"
            >
              <path
                fill="currentColor"
                d="M20 7V5h-2V3h2V1h2v2h2v2h-2v2zm-4.5 4q.625 0 1.063-.437T17 9.5t-.437-1.062T15.5 8t-1.062.438T14 9.5t.438 1.063T15.5 11m-7 0q.625 0 1.063-.437T10 9.5t-.437-1.062T8.5 8t-1.062.438T7 9.5t.438 1.063T8.5 11m3.5 6.5q1.7 0 3.088-.962T17.1 14H6.9q.625 1.575 2.013 2.538T12 17.5m0 4.5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2q1.075 0 2.075.213T16 2.825V7h2v2h3.55q.225.725.338 1.463T22 12q0 2.075-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
              />
            </svg>
          </button>
        )}

        {/* Message reactions */}
        <span className="messageReactions">
          {Object.entries(
            message.reactions.reduce((acc, reaction) => {
              acc[reaction.type] = (acc[reaction.type] || 0) + 1;
              return acc;
            }, {})
          ).map(([type, count]) => (
            <span key={type} className="messageReactionType">
              <span className="reaction-emoji">{type}</span>
              <span className="reaction-count">{count > 1 ? count : ""}</span>
            </span>
          ))}
        </span>
      </p>
    </>
  );
};

Message.propTypes = {
  message: propTypes.object,
  handleMoreButton: propTypes.func,
  handleSubmitEdit: propTypes.func,
  currentMessage: propTypes.object,
};
export default Message;
