"use client";
import { useEffect } from "react";
import { toast } from "sonner";

export function WebSocketProvider({ children }) {
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}/${userId}`
    );

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      toast(`🔔 ${data.message}`);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    return () => {
      socket.close();
    };
  }, []);

  return <>{children}</>;
}