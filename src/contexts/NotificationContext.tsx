"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface NotificationData {
  type: "success" | "error";
  title: string;
  message?: string;
  link?: {
    url: string;
    text: string;
  };
  customContent?: React.ReactNode;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

interface NotificationContextType {
  notification: NotificationData | null;
  showNotification: (notification: NotificationData) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationData | null>(
    null
  );

  const showNotification = useCallback((notification: NotificationData) => {
    setNotification(notification);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
