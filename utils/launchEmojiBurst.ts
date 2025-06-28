// utils/launchEmojiBurst.ts
import confetti from "canvas-confetti";

export function launchEmojiBurst(emojis: string[]) {
  emojis.forEach((emoji, index) => {
    confetti({
      particleCount: 10,
      angle: 90,
      spread: 70,
      origin: { x: 0.5, y: 0.3 },
      gravity: 0.5,
      ticks: 100,
      scalar: 1.2,
      shapes: ["text"],         // ✅ fixed: this tells confetti to render `text`
      zIndex: 9999,
      startVelocity: 25,
      decay: 0.9,
      disableForReducedMotion: true,
      text: emoji,              // ✅ pass emoji as the actual particle
    });
  });
}
