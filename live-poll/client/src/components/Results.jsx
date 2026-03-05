import { useStore } from "../store/StoreProvider";

function Results({ sendMessage }) {
  const { state, dispatch } = useStore();

  const handleVote = (idx) => {
    if (state.hasVoted) return;
    sendMessage("VOTE", {
      roomId: state.roomId,
      questionId: state.question.id,
      optionIndex: idx,
      name: state.name,
    });
    // Optimistically disable voting buttons
    dispatch({ type: "SET_VOTED" });
  };

  if (!state.question) {
    return (
      <div className="card glass-effect results-card slide-in">
        <h3 className="waiting-pulse">Waiting for host to publish...</h3>
        <p>
          You're in room {state.roomId} as {state.name} ({state.role})
        </p>
      </div>
    );
  }

  const highestVote = Math.max(...state.counts);

  return (
    <div className="card glass-effect results-card slide-in">
      <h2 className="question-title">{state.question.text}</h2>

      {state.role === "player" && !state.hasVoted && (
        <p className="instruction">Select an option to vote</p>
      )}

      {state.role === "player" && state.hasVoted && (
        <p className="instruction fade-in">✅ Thanks for voting!</p>
      )}

      <ul className="options-list-grid">
        {state.question.options.map((opt, idx) => {
          const count = state.counts[idx] || 0;
          const percentage =
            state.totalVotes > 0
              ? ((count / state.totalVotes) * 100).toFixed(1)
              : 0;

          const isWinner =
            state.totalVotes > 0 && count === highestVote && highestVote > 0;

          return (
            <li key={idx} className="option-item">
              <div className="option-header">
                <span className="option-name">{opt}</span>
                <span className="option-count">
                  {count} votes ({percentage}%)
                </span>
              </div>

              <div
                className={`bar-container ${state.role === "player" && !state.hasVoted ? "clickable" : ""}`}
                onClick={() => state.role === "player" && handleVote(idx)}
              >
                <div
                  className={`bar-fill ${isWinner ? "winner-bar" : ""}`}
                  style={{ width: `${percentage}%` }}
                ></div>

                {state.role === "player" && !state.hasVoted && (
                  <div className="vote-overlay">Vote</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="total-votes">
        <strong>Total Votes:</strong> {state.totalVotes}
      </div>
    </div>
  );
}

export default Results;
