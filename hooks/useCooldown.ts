import { useRef, useCallback, useState } from "react";

export default function useCooldown(durationMs: number = 1000) {
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const trigger = useCallback(() => {
    if (isCoolingDown) {
      console.log("⛔ Bookmark action blocked by cooldown");
      return false;
    }

    console.log("✅ Bookmark action allowed");
    setIsCoolingDown(true);

    cooldownRef.current = setTimeout(() => {
      setIsCoolingDown(false);
      console.log("🔁 Cooldown reset");
    }, durationMs);

    return true;
  }, [isCoolingDown, durationMs]);

  return {
    isCoolingDown,
    trigger,
  };
}
