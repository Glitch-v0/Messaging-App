import { useState } from "react";
import propTypes from "prop-types";
import { createConversation } from "../api/conversations.js";

const NewConversation = ({ friends }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [open, setOpen] = useState(false);

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
      <button id="newConversationButton" onClick={() => setOpen(!open)}>
        {open ? "x" : "+"}
      </button>
      {open && (
        <form
          id="newConversationForm"
          onSubmit={(e) => {
            e.preventDefault();
            createConversation(selectedFriends, e.target.initialMessage.value);
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
            />
          </div>

          <button id="startConversationButton" type="submit">
            Start Conversation
          </button>
        </form>
      )}
    </>
  );
};

NewConversation.propTypes = {
  friends: propTypes.array.isRequired,
};

export default NewConversation;
