import { useMemo, useCallback } from "react";
import { useStore } from "./store/StoreProvider";
import { useWebSocket } from "./hooks/useWebSocket";
import Join from "./components/Join";
import Host from "./components/Host";
import Results from "./components/Results";
import { Sparkles, Wifi, WifiOff, Loader2, Globe } from "lucide-react";
import { t } from "./i18n";
import "./index.css";

const WS_URL = "ws://localhost:8080";

function App() {
  const { state, dispatch } = useStore();
  const lang = state.language || "en";
  const dict = t[lang];

  const handleMessage = useCallback(
    (msg) => {
      if (msg.type === "STATE") {
        dispatch({ type: "SET_ROOM_STATE", payload: msg.payload });
      } else if (msg.type === "ERROR") {
        dispatch({ type: "SET_ERROR", payload: msg.payload.message });
        setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 5000);
      }
    },
    [dispatch],
  );

  const handlers = useMemo(
    () => ({
      onConnecting: () =>
        dispatch({ type: "SET_CONNECTION_STATE", payload: "Connecting" }),
      onOpen: (e, ws) => {
        dispatch({ type: "SET_CONNECTION_STATE", payload: "Connected" });
        if (state.hasJoined && state.roomId && state.name && state.role) {
          ws.send(
            JSON.stringify({
              type: "JOIN",
              payload: {
                roomId: state.roomId,
                name: state.name,
                role: state.role,
              },
            }),
          );
        }
      },
      onMessage: handleMessage,
      onClose: () =>
        dispatch({ type: "SET_CONNECTION_STATE", payload: "Offline" }),
      onError: () =>
        dispatch({ type: "SET_CONNECTION_STATE", payload: "Offline" }),
    }),
    [
      dispatch,
      handleMessage,
      state.hasJoined,
      state.roomId,
      state.name,
      state.role,
    ],
  );

  const { sendMessage } = useWebSocket(WS_URL, handlers);

  const renderContent = () => {
    if (!state.hasJoined) {
      return <Join sendMessage={sendMessage} />;
    }
    if (state.role === "host") {
      return (
        <div className="layout">
          <Host sendMessage={sendMessage} />
          <Results sendMessage={sendMessage} />
        </div>
      );
    }
    return <Results sendMessage={sendMessage} />;
  };

  const getStatusIcon = () => {
    switch (state.connectionState) {
      case "Connected":
        return {
          icon: <Wifi size={14} className="text-success" />,
          text: dict.connected,
        };
      case "Connecting":
        return {
          icon: <Loader2 size={14} className="animate-spin" />,
          text: dict.connecting,
        };
      default:
        return {
          icon: <WifiOff size={14} className="text-danger" />,
          text: dict.offline,
        };
    }
  };

  const statusInfo = getStatusIcon();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          <Sparkles size={32} className="logo-icon" />
          {dict.title}
        </h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={() => dispatch({ type: "TOGGLE_LANGUAGE" })}
            className="btn-secondary"
            style={{
              padding: "0.2rem 0.6rem",
              fontSize: "0.85rem",
              width: "auto",
            }}
          >
            <Globe size={14} />
            {lang.toUpperCase()}
          </button>

          <div
            className={`status-badge status-${state.connectionState?.toLowerCase()}`}
          >
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
          </div>
        </div>
      </header>

      {state.error && (
        <div className="error-toast fade-in">
          <WifiOff size={18} />
          {state.error}
        </div>
      )}

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
