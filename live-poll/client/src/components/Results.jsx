import { useStore } from "../store/StoreProvider";
import {
  PieChart,
  Vote,
  BadgeCheck,
  MousePointer2,
  Hourglass,
  Users2,
  Trophy,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { t } from "../i18n";

function Results({ sendMessage }) {
  const { state, dispatch } = useStore();
  const lang = state.language || "en";
  const dict = t[lang];

  const handleClearVote = () => {
    sendMessage("CLEAR_VOTE", {
      roomId: state.roomId,
      questionId: state.question.id,
      name: state.name,
    });
    dispatch({ type: "CLEAR_VOTE" });
  };

  const handleLeaveRoom = () => {
    sendMessage("LEAVE_ROOM", {
      roomId: state.roomId,
    });
    dispatch({ type: "LEAVE_ROOM" });
  };

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
          <h3 className="waiting-pulse">{dict.waiting}</h3>
          <p className="room-info-sub">
            <Users2 size={14} />
            {dict.room} {state.roomId} • {state.name}
          </p>
          <button
            className="btn-secondary"
            onClick={handleLeaveRoom}
            style={{
              marginTop: "2rem",
              width: "fit-content",
              padding: "0.5rem 1rem",
            }}
          >
            <LogOut size={16} />
            {dict.leaveRoom}
          </button>
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
          {dict.clickToVote}
        </p>
      )}

      {state.role === "player" && state.hasVoted && (
        <p className="success-msg fade-in">
          <BadgeCheck size={20} />
          {dict.voteRecorded}
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
                  {count} {dict.votesInfo} ({percentage}%)
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
                    <span>{dict.confirmVote}</span>
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
          {dict.totalParticipation} <strong>{state.totalVotes}</strong>
        </span>
      </div>

      {state.role === "player" && (
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {state.hasVoted && (
            <button
              className="btn-secondary"
              onClick={handleClearVote}
              style={{ width: "fit-content", padding: "0.5rem 1rem" }}
            >
              <RefreshCw size={16} />
              {dict.revote}
            </button>
          )}
          <button
            className="btn-secondary"
            onClick={handleLeaveRoom}
            style={{
              width: "fit-content",
              padding: "0.5rem 1rem",
              borderColor: "rgba(229, 115, 115, 0.4)",
              color: "#ef9a9a",
            }}
          >
            <LogOut size={16} />
            {dict.leaveRoom}
          </button>
        </div>
      )}
    </div>
  );
}

export default Results;
