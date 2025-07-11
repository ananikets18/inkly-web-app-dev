"use client";

import ToastPortal from "./ToastPortal";
import { useEffect, useRef, useState } from "react";
import { launchEmojiBurst } from "@/utils/launchEmojiBurst";


export default function FloatingToast({
  message,
  duration = 2500,
  className = "",
}: {
  message: React.ReactNode;
  duration?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(true);
  const hasBurst = useRef(false);

  useEffect(() => {
    if (!hasBurst.current) {
      launchEmojiBurst(["✨", "🌀", "💬"]);
      hasBurst.current = true;
    }

    const timeout = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timeout);
  }, [duration]);

  if (!visible) return null;

  return (
    <ToastPortal>
      <div
        role="status"
        aria-live="polite"
        className={`fixed top-16 inset-x-0 mx-auto max-w-fit z-[1000] rounded-full bg-purple-600 text-white px-4 py-2 text-xs font-medium shadow-lg animate-fade-in-out ${className}`}
      >
        {message}
      </div>
    </ToastPortal>
  );
}
