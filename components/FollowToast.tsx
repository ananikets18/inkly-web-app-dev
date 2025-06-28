"use client";

import { useEffect, useState } from "react";
import ToastPortal from "./ToastPortal";

export default function FollowToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <ToastPortal>
      <div
        role="status"
        aria-live="polite"
        className="fixed top-16 inset-x-0 mx-auto max-w-fit z-[1000] rounded-full bg-green-600 text-white px-4 py-2 text-xs font-medium shadow-lg animate-fade-in-out"
      >
        {message}
      </div>
    </ToastPortal>
  );
}
