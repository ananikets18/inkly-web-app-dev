"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type FollowIntent = "follow" | "unfollow" | null;

type FollowButtonProps = {
  onFollow: (e: React.MouseEvent) => void;
  isFollowing: boolean;
  isLoading: boolean;
  followIntent: FollowIntent;
  className?: string;
  onFollowed?: () => void;
  onUnfollowed?: () => void;
};

const FollowButton = ({ onFollow, isFollowing, isLoading, followIntent, className }: FollowButtonProps) => {
  let label = "Follow";

  if (isLoading) {
    if (followIntent === "unfollow") label = "Unfollowing...";
    else if (followIntent === "follow") label = "Following...";
  } else if (isFollowing) {
    label = "Following";
  }

    return (
          <Button
            disabled={isLoading}
            onClick={onFollow}
            aria-label={label}
            role="button"
      className={`flex items-center gap-0 rounded-full text-xs font-semibold transition-all duration-200 h-auto px-4 py-1.5
          bg-[#fff] border border-[#e9d5ff] text-purple-500   
          dark:bg-[#181022] dark:border-[#6d28d9] dark:text-purple-200
          ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#9333ea] hover:text-white active:bg-[#7e22ce] dark:hover:bg-[#6d28d9] dark:hover:text-white dark:active:bg-[#581c87]"}
          ${className || ""}`}
            title={isLoading ? (followIntent === "unfollow" ? "Unfollowing..." : "Following...") : (isFollowing ? "Unfollow this user" : "Follow this user")}
            aria-pressed={isFollowing}
            aria-busy={isLoading}
          >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-1"
          >
          {label === "Following" && <Check className="w-4 h-4 text-[#9333ea] dark:text-purple-200" aria-hidden="true" />}
            <span>{label}</span>
          </motion.span>
        </AnimatePresence>
      </Button>
    );
};

export default FollowButton;
