import { useEffect, useRef } from "react";
import { queryClient } from "@/lib/queryClient";
import type { Broker } from "@shared/schema";

type WebSocketMessage =
  | { type: "broker_added"; broker: Broker }
  | { type: "broker_updated"; broker: Broker }
  | { type: "status_changed"; broker: Broker }
  | { type: "broker_deleted"; id: string };

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function connect() {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case "broker_added":
            case "broker_updated":
            case "status_changed":
            case "broker_deleted":
              // Invalidate queries to refetch data
              queryClient.invalidateQueries({ queryKey: ["/api/brokers"] });
              break;
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);
}
