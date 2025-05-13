import { useState } from "react";
import propTypes from "prop-types";

const NewConversation = ({
  friends,
  newConversationMutation,
  anyConversations,
}) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [open, setOpen] = useState(!anyConversations);

  const filteredFriends = friends.filter(
    (friend) => !selectedFriends.find((f) => f.id === friend.id)
  );

  const handleSelectOption = (e) => {
    const selectedName = e.target.value;
    const selectedFriend = friends.find((f) => f.name === selectedName);

    //Check if friend is already selected
    if (
      selectedFriend &&
      !selectedFriends.find((f) => f.id === selectedFriend.id)
    ) {
      //Add to selected if not a duplicate
      setSelectedFriends([...selectedFriends, selectedFriend]);
      //Clear input
      e.target.value = "";
    }
  };

  const removeFriend = (id) => {
    setSelectedFriends(selectedFriends.filter((friend) => friend.id !== id));
  };

  return (
    <>
      {anyConversations && (
        <button id="newConversationButton" onClick={() => setOpen(!open)}>
          {open ? "x" : "+"}
        </button>
      )}
      {open && (
        <form
          id="newConversationForm"
          onSubmit={async (e) => {
            e.preventDefault();
            const initialMessage = e.target.initialMessage.value;
            await newConversationMutation.mutate({
              participants: selectedFriends,
              message: initialMessage,
            });
            setSelectedFriends([]);
            setOpen(false);
          }}
        >
          <div>
            <div id="selectedFriends">
              {selectedFriends.map((friend) => (
                <div key={friend.id} className="selectedFriendParticipant">
                  {friend.name}
                  <button
                    type="button"
                    onClick={() => removeFriend(friend.id)}
                    className="removeFriendParticipantButton"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* Input tied to a datalist */}
            {filteredFriends.length > 0 ? (
              <input
                list="friends-list"
                onChange={handleSelectOption}
                placeholder="Add recipients"
              />
            ) : (
              <p>(You added all your friends)</p>
            )}
            <datalist id="friends-list">
              {filteredFriends.map((friend) => (
                <option key={friend.id} value={friend.name} />
              ))}
            </datalist>
          </div>

          <div className="newMessageInputContainer">
            <input
              type="text"
              id="initialMessage"
              name="initialMessage"
              placeholder="Type your message..."
              required
            />
          </div>

          <button
            id="startConversationButton"
            type="submit"
            disabled={selectedFriends.length === 0}
          >
            Start Conversation
          </button>

          {anyConversations && (
            <button
              id="cancelConversationButton"
              onClick={() => {
                setSelectedFriends([]);
                setOpen(false);
              }}
            >
              X
            </button>
          )}
        </form>
      )}
    </>
  );
};

NewConversation.propTypes = {
  friends: propTypes.array.isRequired,
  newConversationMutation: propTypes.object.isRequired,
  anyConversations: propTypes.bool.isRequired,
};

export default NewConversation;
