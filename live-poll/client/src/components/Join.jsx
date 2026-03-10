import { useState } from "react";
import { useStore } from "../store/StoreProvider";
import {
  User2,
  Hash,
  ShieldCheck,
  Gamepad2,
  LogIn,
  AlertTriangle,
} from "lucide-react";
import { t } from "../i18n";

function Join({ sendMessage }) {
  const { state, dispatch } = useStore();
  const lang = state.language || "en";
  const dict = t[lang];

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
    dispatch({ type: "SET_JOIN_DATA", payload: formData });
  };

  return (
    <div className="card glass-effect join-card fade-in">
      <h2>
        <ShieldCheck size={28} className="accent-icon" />
        {dict.title}
      </h2>
      <p>Configure your identity to start interacting.</p>

      {localError && (
        <div className="local-error shake">
          <AlertTriangle size={18} />
          {localError}
        </div>
      )}

      <form onSubmit={handleJoin} className="form-group">
        <label>
          <div className="label-with-icon">
            <User2 size={16} />
            <span>{dict.nameLabel}</span>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={
              formData.role === "host"
                ? dict.hostPlaceholder
                : dict.playerPlaceholder
            }
            maxLength={20}
          />
        </label>

        <label>
          <div className="label-with-icon">
            <Hash size={16} />
            <span>{dict.roomLabel}</span>
          </div>
          <input
            type="text"
            name="roomId"
            value={formData.roomId}
            onChange={handleInputChange}
            placeholder={dict.roomPlaceholder}
            maxLength={10}
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
            <Gamepad2 size={32} />
            <span>{dict.player}</span>
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
            <ShieldCheck size={32} />
            <span>{dict.host}</span>
          </label>
        </div>

        <button type="submit" className="btn-primary">
          <span>{dict.connect}</span>
          <LogIn size={20} />
        </button>
      </form>
    </div>
  );
}

export default Join;
