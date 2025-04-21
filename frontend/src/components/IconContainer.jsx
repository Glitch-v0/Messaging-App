import propTypes from "prop-types";

const handleReactButton = async (e) => {
  const messageRect = e.target.getBoundingClientRect();
  const reactionContainer = document.querySelector("#reactionContainer");

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

const IconContainer = ({
  currentConversation,
  currentMessage,
  deleteMessageMutation,
  messageEditingMode,
  setMessageEditingMode,
}) => {
  const hideIconContainer = () => {
    const iconContainer = document.getElementById("iconContainer");
    iconContainer.style.zIndex = "-2";
  };

  const handleEditButton = async () => {
    console.log("Clicked edit button!");
    await setMessageEditingMode(!messageEditingMode);
    hideIconContainer();
    if (messageEditingMode === true) {
      setTimeout(() => {
        // console.log(`Message editing mode: ${messageEditingMode}`);
        const form = document.getElementById(currentMessage);
        const input = form.getElementsByTagName("input")[0];
        // console.log({ form, input });
        input.focus();
      }, 500);
    }
  };
  return (
    <div
      id="iconContainer"
      style={{ zIndex: "-2" }}
      onMouseLeave={() => {
        hideIconContainer();
      }}
    >
      <svg
        className="messageIcon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        id="reactToMessageIcon"
        onClick={(e) => {
          handleReactButton(e);
        }}
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
        onClick={async () => {
          await deleteMessageMutation.mutate(
            currentConversation,
            currentMessage
          );
          hideIconContainer();
        }}
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
  );
};

IconContainer.propTypes = {
  currentMessage: propTypes.string,
  currentConversation: propTypes.object,
  deleteMessageMutation: propTypes.object,
  handleReactButton: propTypes.func,
  setMessageEditingMode: propTypes.func,
  messageEditingMode: propTypes.bool,
};

export default IconContainer;
