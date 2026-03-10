import { useStore } from "../store/StoreProvider";
import {
  PieChart,
  Vote,
  BadgeCheck,
  MousePointer2,
  Hourglass,
  Users2,
  Trophy,
} from "lucide-react";

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
    dispatch({ type: "SET_VOTED" });
  };

  if (!state.question) {
    return (
      <div className="card glass-effect results-card slide-in">
        <div className="waiting-container">
          <Hourglass size={48} className="animate-pulse-slow icon-muted" />
          <h3 className="waiting-pulse">Waiting for host...</h3>
          <p className="room-info-sub">
            <Users2 size={14} />
            Room: {state.roomId} • {state.name}
          </p>
        </div>
      </div>
    );
  }

  const highestVote = Math.max(...state.counts);

  return (
    <div className="card glass-effect results-card slide-in">
      <h2 className="question-title">
        <PieChart size={24} className="accent-icon" />
        {state.question.text}
      </h2>

      {state.role === "player" && !state.hasVoted && (
        <p className="instruction">
          <MousePointer2 size={16} className="animate-bounce-subtle" />
          Click an option to cast your vote
        </p>
      )}

      {state.role === "player" && state.hasVoted && (
        <p className="success-msg fade-in">
          <BadgeCheck size={20} />
          Your vote has been recorded!
        </p>
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
                >
                  {isWinner && <Trophy size={14} className="winner-icon" />}
                </div>

                {state.role === "player" && !state.hasVoted && (
                  <div className="vote-overlay">
                    <Vote size={20} />
                    <span>Confirm Vote</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="total-votes-footer">
        <Users2 size={18} />
        <span>
          Total Participation: <strong>{state.totalVotes}</strong>
        </span>
      </div>
    </div>
  );
}

export default Results;
