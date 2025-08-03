
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/utils";
import { Bell, Check, X, Info, AlertTriangle, CheckCircle } from "lucide-react";

export function NotificationCenter({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "warning":
        return "border-l-yellow-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <CardDescription>
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-l-4 ${getNotificationColor(
                        notification.type
                      )} ${!notification.read ? "bg-muted/50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onMarkAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDismiss(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage or API
    const local = localStorage.getItem("notifications");
    const parsed = local ? JSON.parse(local) : [];
    setNotifications(parsed);

    // Fetch unread from backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/unread`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("resolveit_token")}`,
      },
    })
      .then((res) => res.json())
      .then((serverNotifications) => {
        // Combine and deduplicate by id
        const merged = [...parsed];
        console.log("Server notifications:", serverNotifications);
        serverNotifications.forEach((notif) => {
          if (!merged.some((n) => n.id === notif.id)) {
            merged.push(notif);
          }
        });
        setNotifications(merged);
        localStorage.setItem("notifications", JSON.stringify(merged));
      });
  }, []);

  // const addNotification = (notification) => {
  //   const newNotification = {
  //     id: Date.now().toString(),
  //     created_at: new Date().toISOString(),
  //     read: false,
  //     ...notification,
  //   };

  //   setNotifications((prev) => {
  //     const updated = [newNotification, ...prev];
  //     localStorage.setItem("notifications", JSON.stringify(updated));
  //     return updated;
  //   });
  // };

const addNotification = (notification) => {
  const newNotification = {
    ...notification,
    is_read: notification.is_read ?? false,
  };

  setNotifications((prev) => {
    // Avoid duplicates by ID
    const updated = [newNotification, ...prev.filter((n) => n.id !== newNotification.id)];
    localStorage.setItem("notifications", JSON.stringify(updated));
    return updated;
  });
};

  // const markAsRead = (id) => {
  //   setNotifications((prev) => {
  //     const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
  //     localStorage.setItem("notifications", JSON.stringify(updated));
  //     return updated;
  //   });
  // };


  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    localStorage.setItem("notifications", JSON.stringify(notifications));

    await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  };


const markAllAsRead = async () => {
  // Update frontend state immediately
  const updated = notifications.map((n) => ({ ...n, is_read: true }))
  setNotifications(updated)
  localStorage.setItem("notifications", JSON.stringify(updated))

  // Notify backend (single request)
  await fetch(`/api/notifications/mark-all-read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
}

  const dismissNotification = (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  };


  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  };
}
