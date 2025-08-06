"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, X } from "lucide-react";

interface NotificationProps {
  type: "success" | "error";
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function Notification({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the slide-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    setTimeout(onClose, 300);
  };

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  const borderColor =
    type === "success" ? "border-green-500" : "border-red-500";
  const iconBgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div
        className={`${bgColor} ${borderColor} border rounded-lg p-4 shadow-lg backdrop-blur-sm max-w-md w-full mx-4`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`${iconBgColor} rounded-full p-1 flex items-center justify-center flex-shrink-0 mt-0.5`}
          >
            {type === "success" ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm">{title}</h4>
            {message && <p className="text-white/90 text-sm mt-1">{message}</p>}
          </div>

          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-1 flex-shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
