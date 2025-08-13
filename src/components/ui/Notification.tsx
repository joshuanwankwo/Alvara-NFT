"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, X, ExternalLink } from "lucide-react";

interface NotificationProps {
  type: "success" | "error";
  title: string;
  message?: string;
  link?: {
    url: string;
    text: string;
  };
  customContent?: React.ReactNode;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function Notification({
  type,
  title,
  message,
  link,
  customContent,
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

  const bgGradient =
    type === "success"
      ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600"
      : "bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600";
  const borderColor =
    type === "success" ? "border-emerald-400/50" : "border-rose-400/50";
  const iconBgColor = type === "success" ? "bg-emerald-500" : "bg-rose-500";
  const glowShadow =
    type === "success"
      ? "shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7)]"
      : "shadow-[0_10px_30px_-10px_rgba(244,63,94,0.7)]";

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`${bgGradient} ${borderColor} ${glowShadow} border rounded-2xl p-5 shadow-xl backdrop-blur-md max-w-2xl sm:max-w-3xl lg:max-w-4xl w-full mx-4`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`${iconBgColor} rounded-full p-2 flex items-center justify-center flex-shrink-0 mt-0.5 ring-2 ring-white/20`}
          >
            {type === "success" ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <AlertCircle className="w-5 h-5 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base tracking-wide">
              {title}
            </h4>
            {message && (
              <p className="text-white/90 text-sm mt-2 leading-relaxed max-w-none">
                {message}
              </p>
            )}
            {link && (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-sm mt-2 transition-colors underline decoration-white/30 hover:decoration-white"
              >
                {link.text}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {customContent && <div className="mt-3">{customContent}</div>}
          </div>

          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors p-2 flex-shrink-0 rounded-full hover:bg-white/10"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
