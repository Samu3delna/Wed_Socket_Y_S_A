import { useState } from "react";
import { useStore } from "../store/StoreProvider";

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

    // reset form (optional, could leave it)
    setQuestionText("");
    setOptions(["", "", ""]);
  };

  return (
    <div className="card glass-effect host-card slide-in">
      <h3>Host Panel</h3>
      <p>
        Room: <strong>{state.roomId}</strong>
      </p>

      {localError && <div className="local-error">{localError}</div>}

      <div className="form-group">
        <label>
          Question
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="What is your favorite color?"
          />
        </label>

        <label>Options (2-4)</label>
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
                  ✖
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 4 && (
          <button className="btn-secondary" onClick={addOption}>
            + Add Option
          </button>
        )}

        <button className="btn-primary mt-4" onClick={handleCreatePoll}>
          🚀 Publish Poll
        </button>
      </div>
    </div>
  );
}

export default Host;
