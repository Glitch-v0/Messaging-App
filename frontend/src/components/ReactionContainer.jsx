import propTypes from "prop-types";

const hideReactionContainer = () => {
  const container = document.querySelector("#reactionContainer");
  container.style.zIndex = "-2";
  container.tabIndex = "-1";
  container.style.display = "none";
};
const ReactionContainer = ({ reactMessageMutation }) => {
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
      <button
        onClick={(e) => {
          reactMessageMutation.mutate(e.currentTarget.textContent);
          hideReactionContainer();
        }}
      >
        👍
      </button>
      <button
        onClick={(e) => {
          reactMessageMutation.mutate(e.currentTarget.textContent);
          hideReactionContainer();
        }}
      >
        👎
      </button>
      <button
        onClick={(e) => {
          reactMessageMutation.mutate(e.currentTarget.textContent);
          hideReactionContainer();
        }}
      >
        ❤️
      </button>
      <button
        onClick={(e) => {
          reactMessageMutation.mutate(e.currentTarget.textContent);
          hideReactionContainer();
        }}
      >
        😂
      </button>
      <button
        onClick={(e) => {
          reactMessageMutation.mutate(e.currentTarget.textContent);
          hideReactionContainer();
        }}
      >
        👏
      </button>
      <button
        onClick={(e) => {
          reactMessageMutation.mutate(e.currentTarget.textContent);
          hideReactionContainer();
        }}
      >
        🙌
      </button>
      <button
        onClick={(e) => {
          reactMessageMutation.mutate(e.currentTarget.textContent);
          hideReactionContainer();
        }}
      >
        🔥
      </button>
    </div>
  );
};

ReactionContainer.propTypes = {
  reactMessageMutation: propTypes.object,
};
export default ReactionContainer;
