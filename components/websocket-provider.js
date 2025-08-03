"use client";
import { title } from "process";
import { useEffect } from "react";
import { toast } from "sonner";

export function WebSocketProvider({ children }) {
  useEffect(() => {
    let userData = {};
    const resolveit_user = localStorage.getItem("resolveit_user");
    if (!resolveit_user) return;
    try {
      userData = JSON.parse(resolveit_user);
    } catch {
      console.log("unable to parse userdata");
    }

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}/${userData.id}`
    );

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = event.data
        // show toast
        toast(`🔔 ${data.message}`);
        addNotification(data);
        console.log("📨 Message received:", data);
      } 
        catch (err) {
          console.error("❌ Failed to parse message:", event.data);
      }
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket disconnected. Reconnecting...");
  //     setTimeout(() => {
    // Re-initialize socket logic here

  // }, 3000);
    };

    return () => {
      socket.close();
    };
  }, []);

  return <>{children}</>;
}
