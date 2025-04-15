const ReactionContainer = () => {
  return (
    <div
      className="reactionContainer"
      onMouseLeave={() => {
        const container = document.querySelector(".reactionContainer");
        container.style.zIndex = "-2";
      }}
    >
      <button>👍</button>
      <button>👎</button>
      <button>❤️</button>
      <button>😂</button>
      <button>👏</button>
      <button>🙌</button>
      <button>🔥</button>
    </div>
  );
};

export default ReactionContainer;
