"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    function connectWebSocket() {
      // Close existing socket if any
      if (socket) {
        socket.close();
      }

      const token = localStorage.getItem("resolveit_token");
      if (!token) {
        console.warn("No token found. WebSocket not connecting.");
        return;
      }

      console.log("Connecting WebSocket with token...");
      const newSocket = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}?token=${token}`
      );

      newSocket.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      newSocket.onmessage = (event) => {
        try {
          const data = event.data;
          toast(`🔔 ${data.message}`);
          addNotification(data);
          console.log("📨 Message received:", data);
        } catch (err) {
          console.error("❌ Failed to parse message:", event.data);
        }
      };

      newSocket.onclose = () => {
        console.log("🔌 WebSocket disconnected");
      };

      setSocket(newSocket);
    }

    // Connect initially
    connectWebSocket();

    // Listen for storage changes (when localStorage changes)
    function handleStorageChange(e) {
      if (e.key === "resolveit_token") {
        console.log("Token changed, reconnecting WebSocket...");
        connectWebSocket();
      }
    }

    // Listen for custom events (for same-tab changes)
    function handleTokenChange() {
      console.log("Token changed (same tab), reconnecting WebSocket...");
      connectWebSocket();
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenChanged", handleTokenChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChanged", handleTokenChange);
      if (socket) {
        socket.close();
      }
    };
  }, []); // Empty dependency - we handle changes with event listeners

  return <>{children}</>;
}