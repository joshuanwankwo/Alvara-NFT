"use client";

import { useNotification } from "@/contexts/NotificationContext";
import { Notification } from "./Notification";

export function GlobalNotification() {
  const { notification, hideNotification } = useNotification();

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        link={notification.link}
        onClose={hideNotification}
      />
    </div>
  );
}
