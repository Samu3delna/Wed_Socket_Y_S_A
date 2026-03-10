import { useMemo, useCallback } from "react";
import { useStore } from "./store/StoreProvider";
import { useWebSocket } from "./hooks/useWebSocket";
import Join from "./components/Join";
import Host from "./components/Host";
import Results from "./components/Results";
import { Leaf, Wifi, WifiOff, Loader } from "lucide-react";
import "./index.css";

// In production, connect to the same host; in dev, use localhost:8080
const WS_URL = import.meta.env.PROD
  ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`
  : "ws://localhost:8080";

function App() {
  const { state, dispatch } = useStore();

  const handleMessage = useCallback(
    (msg) => {
      if (msg.type === "STATE") {
        dispatch({ type: "SET_ROOM_STATE", payload: msg.payload });
      } else if (msg.type === "ERROR") {
        dispatch({ type: "SET_ERROR", payload: msg.payload.message });
        // clear error after 5s
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
        // Restore session if already joined
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

  const getStatusClass = () => {
    switch (state.connectionState) {
      case "Connected":
        return "status-connected";
      case "Reconnecting":
      case "Connecting":
        return "status-connecting";
      case "Offline":
        return "status-offline";
      default:
        return "status-offline";
    }
  };

  const getStatusIcon = () => {
    switch (state.connectionState) {
      case "Connected":
        return <Wifi size={14} />;
      case "Reconnecting":
      case "Connecting":
        return <Loader size={14} className="spin-icon" />;
      case "Offline":
        return <WifiOff size={14} />;
      default:
        return <WifiOff size={14} />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          <Leaf size={32} />
          Live Poll
        </h1>
        <div className={`status-badge ${getStatusClass()}`}>
          {getStatusIcon()}
          {state.connectionState}
          <div className="pulse"></div>
        </div>
      </header>

      {state.error && <div className="error-toast">{state.error}</div>}

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
