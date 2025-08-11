"use client";

import { useNotification } from "@/contexts/NotificationContext";
import { Notification } from "./Notification";

export function GlobalNotification() {
  const { notification, hideNotification } = useNotification();

  if (!notification) return null;

  return (
    <Notification
      type={notification.type}
      title={notification.title}
      message={notification.message}
      link={notification.link}
      onClose={hideNotification}
    />
  );
}
