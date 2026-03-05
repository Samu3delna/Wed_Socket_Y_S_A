import { useEffect, useRef, useCallback } from "react";

export function useWebSocket(url, handlers) {
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    handlers.onConnecting?.();
    const ws = new WebSocket(url);

    ws.onopen = (e) => {
      handlers.onOpen?.(e, ws);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handlers.onMessage?.(msg);
      } catch (e) {
        console.error("Invalid JSON received", e);
      }
    };

    ws.onclose = () => {
      handlers.onClose?.();
      // Auto-reconnect
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = (e) => {
      handlers.onError?.(e);
    };

    wsRef.current = ws;
  }, [url, handlers]); // Ensure handlers is wrapped in useCallback or memoized if possible, though here it's fine

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimeout.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((type, payload) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  return { sendMessage };
}
