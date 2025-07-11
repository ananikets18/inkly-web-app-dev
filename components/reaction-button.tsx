// reaction-button.tsx
// Provides the ReactionButton component and the reactions array (with icons/colors/labels).
// Keep the reactions array in sync with any component that displays reactions (e.g., EchoedByModal).
// To add a new reaction, update the array and ensure icons/colors are available in all consumers.
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Smile, Ghost, Zap } from "lucide-react";
import ToastPortal from "./ToastPortal";

interface Reaction {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  hoverColor: string;
  bgColor: string;
  sound: "like" | "hover" | "click";
  animation: { scale: number; rotate?: number[] };
}

export const reactions: Reaction[] = [
  {
    id: "love",
    icon: Heart,
    label: "Love",
    color: "text-pink-500",
    hoverColor: "hover:text-pink-600",
    bgColor: "hover:bg-pink-50",
    sound: "like",
    animation: { scale: 1.2, rotate: [0, -10, 10, 0] },
  },
  {
    id: "felt",
    icon: Sparkles,
    label: "Felt That",
    color: "text-purple-500",
    hoverColor: "hover:text-purple-600",
    bgColor: "hover:bg-purple-50",
    sound: "hover",
    animation: { scale: 1.3 },
  },
  {
    id: "relatable",
    icon: Smile,
    label: "Relatable",
    color: "text-yellow-600",
    hoverColor: "hover:text-yellow-700",
    bgColor: "hover:bg-yellow-50",
    sound: "click",
    animation: { scale: 1.1, rotate: [0, 5, -5, 0] },
  },
  {
    id: "haunted",
    icon: Ghost,
    label: "Haunted",
    color: "text-gray-600",
    hoverColor: "hover:text-gray-700",
    bgColor: "hover:bg-gray-50",
    sound: "hover",
    animation: { scale: 1.2, rotate: [0, -4, 4, 0] },
  },
  {
    id: "wow",
    icon: Zap,
    label: "Wow",
    color: "text-blue-500",
    hoverColor: "hover:text-blue-600",
    bgColor: "hover:bg-blue-50",
    sound: "like",
    animation: { scale: 1.25 },
  },
];

interface ReactionButtonProps {
  onReaction?: (reactionId: string | null) => void;
  onSoundPlay?: (soundType: "click" | "hover" | "like") => void;
  selectedReaction?: string | null;
  reactionCount?: number;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline";
  className?: string;
}

export default function ReactionButton({
  onReaction,
  onSoundPlay,
  selectedReaction = null,
  reactionCount = 0,
  size = "md",
  variant = "ghost",
  className = "",
}: ReactionButtonProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverRef = useRef(false);
  const cooldownRef = useRef(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 768);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      onSoundPlay?.("hover");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShowReactions(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !hoverRef.current) {
      timeoutRef.current = setTimeout(() => setShowReactions(false), 300);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
  e.stopPropagation();

  if (cooldownRef.current) {
    setToastMessage("Too fast! Hold on a sec.");
    return;
  }

  cooldownRef.current = true;
  setTimeout(() => {
    cooldownRef.current = false;
  }, 500);

  if (isMobile) {
    onSoundPlay?.("click");

    if (selectedReaction) {
      onReaction?.(null);        // ✅ Unreact directly
      setShowReactions(false);   // ✅ Close if open
    } else {
      setShowReactions(!showReactions); // ✅ Show modal
    }
  } else {
    onSoundPlay?.("like");

    if (selectedReaction) {
      onReaction?.(null); // ✅ Unreact
    } else {
      onReaction?.("love"); // ✅ Default to love
    }
  }
};

  


  const handleReactionSelect = (
    reactionId: string,
    sound: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onSoundPlay?.(sound as any);

    if (selectedReaction === reactionId) {
      onReaction?.(null);
    } else {
      onReaction?.(reactionId);
    }
    setShowReactions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const selectedReactionData = reactions.find(
    (r) => r.id === selectedReaction
  );
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const RenderedIcon = selectedReactionData?.icon || Heart;

  return (
    <>
      <div
        className="relative inline-flex items-center"
        onMouseEnter={() => {
          hoverRef.current = true;
          handleMouseEnter();
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
          handleMouseLeave();
        }}
      >
        <Button
          ref={buttonRef}
          variant={variant}
          size="icon"
          className={`${sizeClasses[size]} relative ${
            selectedReaction ? selectedReactionData?.color : "text-gray-500"
          } transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
          onClick={handleClick}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedReaction}
              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              <RenderedIcon
                className={`${
                  size === "sm"
                    ? "w-3.5 h-3.5"
                    : size === "md"
                    ? "w-4 h-4"
                    : "w-5 h-5"
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </Button>

        <AnimatePresence>
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, y: isMobile ? -10 : 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isMobile ? -10 : 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`absolute z-[9999] left-1/2 transform -translate-x-1/2 ${
                isMobile ? "bottom-full mt-3" : "bottom-full mb-3"
              }`}
            >
              <div className="relative bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-full px-3 py-2 flex flex-row gap-2">
                {reactions.map((reaction, index) => {
                  const Icon = reaction.icon;
                  const isSelected = selectedReaction === reaction.id;
                  return (
                    <motion.button
                      key={reaction.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.15 }}
                      className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                        reaction.color
                      } ${reaction.hoverColor} ${reaction.bgColor} ${
                        isSelected ? "ring-2 ring-black/10" : ""
                      } hover:scale-125 active:scale-95 w-10 h-10`}
                      onClick={(e) =>
                        handleReactionSelect(reaction.id, reaction.sound, e)
                      }
                      title={reaction.label}
                    >
                      <motion.div
                        whileHover={{
                          scale: reaction.animation.scale,
                          rotate: reaction.animation.rotate || [0],
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent border-b-white bottom-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {toastMessage && (
        <ToastPortal>
          <div
            role="status"
            aria-live="polite"
            className="fixed top-16 inset-x-0 mx-auto max-w-fit z-[1000] pointer-events-none rounded-full bg-purple-600 text-white px-4 py-2 text-xs font-medium shadow-lg animate-fade-in-out"
          >
            {toastMessage}
          </div>
        </ToastPortal>
      )}
    </>
  );
}
