import propTypes from "prop-types";

const hideReactionContainer = () => {
  const container = document.querySelector("#reactionContainer");
  container.style.zIndex = "-2";
  container.tabIndex = "-1";
  container.style.display = "none";
};
const ReactionContainer = ({ reactMessageMutation, currentMessage }) => {
  const reactions = ["👍", "👎", "❤️", "😂", "😭", "🤣", "👏", "🙌"];

  return (
    <div
      id="reactionContainer"
      tabIndex={0}
      onMouseLeave={() => {
        const container = document.querySelector("#reactionContainer");
        container.style.zIndex = "-2";
        container.style.display = "none";
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" || e.key === "Esc") {
          const container = document.querySelector("#reactionContainer");
          container.style.zIndex = "-2";
          container.style.display = "none";
        }
      }}
    >
      {reactions.map((emoji) => (
        <button
          key={crypto.randomUUID()}
          onClick={() => {
            reactMessageMutation.mutate(emoji);
            hideReactionContainer();
          }}
          className={
            currentMessage.owner &&
            currentMessage.reactions.some(
              (reaction) =>
                reaction.userId === currentMessage.sender.id &&
                reaction.type === emoji
            )
              ? "yourReaction"
              : "notYourReaction"
          }
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

ReactionContainer.propTypes = {
  currentMessage: propTypes.object,
  reactMessageMutation: propTypes.object,
};
export default ReactionContainer;
