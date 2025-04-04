import { formatRelativeTime } from "../utils/time.js";
import propTypes from "prop-types";

const Message = ({
  messageEditing,
  message,
  handleMoreButton,
  handleSubmitEdit,
  currentMessage,
}) => {
  return messageEditing && message.owner && currentMessage ? (
    <form
      className="messageFromOwner"
      onSubmit={(e) => handleSubmitEdit(e)}
      key={message.id}
    >
      <p id={message.id}>
        <input type="text" name="message" defaultValue={message.content} />
        <sub className="messageTimestamp">
          {formatRelativeTime(message.timestamp)}
        </sub>
        <sub className="messageSender">{message.sender.name}</sub>
        <button type="button" onClick={(e) => handleMoreButton(e)}>
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
    <p
      key={message.id}
      id={message.id}
      className={message.owner ? "messageFromOwner" : "messageFromOther"}
    >
      {message.content}
      <sub className="messageTimestamp">
        {formatRelativeTime(message.timestamp)}
      </sub>
      <sub className="messageSender">{message.sender.name}</sub>
      {message.owner ? (
        <button onClick={(e) => handleMoreButton(e)}>
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
      ) : null}
    </p>
  );
};

Message.propTypes = {
  messageEditing: propTypes.bool,
  message: propTypes.object,
  handleMoreButton: propTypes.func,
  handleSubmitEdit: propTypes.func,
  currentMessage: propTypes.string,
};
export default Message;
