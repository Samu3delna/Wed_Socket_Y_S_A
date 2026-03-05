import { useState } from "react";
import { useStore } from "../store/StoreProvider";

function Join({ sendMessage }) {
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    roomId: "",
    role: "player",
  });
  const [localError, setLocalError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setLocalError("Name is required");
    if (!formData.roomId.trim()) return setLocalError("Room ID is required");

    sendMessage("JOIN", formData);

    // We update local state to reflect we successfully joined
    // If there's a backend validation error, the server sends an ERROR
    dispatch({ type: "SET_JOIN_DATA", payload: formData });
  };

  return (
    <div className="card glass-effect join-card fade-in">
      <h2>Welcome to Live Poll</h2>
      <p>Join a room to vote or host your own poll.</p>

      {localError && <div className="local-error">{localError}</div>}

      <form onSubmit={handleJoin} className="form-group">
        <label>
          Your Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="E.g., Daniel"
            maxLength={20}
          />
        </label>

        <label>
          Room ID
          <input
            type="text"
            name="roomId"
            value={formData.roomId}
            onChange={handleInputChange}
            placeholder="E.g., Room123"
            maxLength={10}
            className="room-input"
          />
        </label>

        <div className="role-selector">
          <label
            className={`role-option ${formData.role === "player" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="role"
              value="player"
              checked={formData.role === "player"}
              onChange={handleInputChange}
            />
            🎮 Player
          </label>
          <label
            className={`role-option ${formData.role === "host" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="role"
              value="host"
              checked={formData.role === "host"}
              onChange={handleInputChange}
            />
            👑 Host
          </label>
        </div>

        <button type="submit" className="btn-primary">
          Enter Room
        </button>
      </form>
    </div>
  );
}

export default Join;
