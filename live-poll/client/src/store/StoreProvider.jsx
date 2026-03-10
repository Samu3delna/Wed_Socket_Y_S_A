import { createContext, useReducer, useContext } from "react";

const initialState = {
  connectionState: "Offline", // Offline | Connecting | Connected | Reconnecting
  roomId: "",
  name: "",
  role: null, // 'player' | 'host'
  hasJoined: false,
  question: null,
  counts: [],
  totalVotes: 0,
  error: null,
  hasVoted: false,
  language: "en", // default language
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CONNECTION_STATE":
      return { ...state, connectionState: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_JOIN_DATA":
      return {
        ...state,
        roomId: action.payload.roomId,
        name: action.payload.name,
        role: action.payload.role,
        hasJoined: true,
        error: null,
      };
    case "SET_ROOM_STATE":
      return {
        ...state,
        question: action.payload.question,
        counts: action.payload.counts,
        totalVotes: action.payload.total,
        error: null,
      };
    case "SET_VOTED":
      return { ...state, hasVoted: true };
    case "CLEAR_VOTE":
      return { ...state, hasVoted: false };
    case "TOGGLE_LANGUAGE":
      return { ...state, language: state.language === "en" ? "es" : "en" };
    case "LEAVE_ROOM":
      return {
        ...state,
        roomId: "",
        name: "",
        role: null,
        hasJoined: false,
        question: null,
        counts: [],
        totalVotes: 0,
        hasVoted: false,
        error: null,
      };
    default:
      return state;
  }
}

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
