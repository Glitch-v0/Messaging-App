import propTypes from "prop-types";

const ReactionContainer = ({ reactMessageMutation }) => {
  return (
    <div
      id="reactionContainer"
      onMouseLeave={() => {
        const container = document.querySelector("#reactionContainer");
        container.style.zIndex = "-2";
      }}
    >
      <button onClick={() => reactMessageMutation.mutate("👍")}>👍</button>
      <button onClick={() => reactMessageMutation.mutate("👎")}>👎</button>
      <button onClick={() => reactMessageMutation.mutate("❤️")}>❤️</button>
      <button onClick={() => reactMessageMutation.mutate("😂")}>😂</button>
      <button onClick={() => reactMessageMutation.mutate("👏")}>👏</button>
      <button onClick={() => reactMessageMutation.mutate("🙌")}>🙌</button>
      <button onClick={() => reactMessageMutation.mutate("🔥")}>🔥</button>
    </div>
  );
};

ReactionContainer.propTypes = {
  reactMessageMutation: propTypes.object,
};
export default ReactionContainer;
