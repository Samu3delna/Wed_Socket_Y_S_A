import { useState } from "react";
import { useStore } from "../store/StoreProvider";
import {
  Settings,
  Send,
  Plus,
  X,
  AlertCircle,
  MessageSquare,
  ListOrdered,
  DoorOpen,
} from "lucide-react";

function Host({ sendMessage }) {
  const { state } = useStore();
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [localError, setLocalError] = useState("");

  const handleOptionChange = (idx, val) => {
    const newOptions = [...options];
    newOptions[idx] = val;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 4) setOptions([...options, ""]);
  };

  const removeOption = (idx) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleCreatePoll = () => {
    if (!questionText.trim()) return setLocalError("Question text is required");
    const validOptions = options.map((o) => o.trim()).filter((o) => o !== "");
    if (validOptions.length < 2)
      return setLocalError("You need at least 2 non-empty options");

    setLocalError("");
    const newQuestion = {
      id: `q_${Date.now()}`,
      text: questionText,
      options: validOptions,
    };

    sendMessage("HOST_SET_QUESTION", {
      roomId: state.roomId,
      question: newQuestion,
    });

    // reset form
    setQuestionText("");
    setOptions(["", "", ""]);
  };

  return (
    <div className="card glass-effect host-card slide-in">
      <h3>
        <Settings size={20} />
        Host Panel
      </h3>
      <p>
        <DoorOpen
          size={14}
          style={{ marginRight: 4, verticalAlign: "middle" }}
        />
        Room: <strong>{state.roomId}</strong>
      </p>

      {localError && (
        <div className="local-error">
          <AlertCircle size={16} />
          {localError}
        </div>
      )}

      <div className="form-group">
        <label>
          <MessageSquare
            size={14}
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
          Question
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="What is your favorite color?"
          />
        </label>

        <label>
          <ListOrdered
            size={14}
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
          Options (2-4)
        </label>
        <div className="options-list">
          {options.map((opt, idx) => (
            <div key={idx} className="option-input-row">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
              />
              {options.length > 2 && (
                <button
                  className="btn-icon"
                  onClick={() => removeOption(idx)}
                  title="Remove option"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 4 && (
          <button className="btn-secondary" onClick={addOption}>
            <Plus size={16} />
            Add Option
          </button>
        )}

        <button className="btn-primary mt-4" onClick={handleCreatePoll}>
          <Send size={18} />
          Publish Poll
        </button>
      </div>
    </div>
  );
}

export default Host;
