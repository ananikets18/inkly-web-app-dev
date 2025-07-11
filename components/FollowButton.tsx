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
};

const FollowButton = ({ onFollow, isFollowing, isLoading, followIntent }: FollowButtonProps) => {
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
            className={`flex items-center gap-1 rounded-full border text-xs font-semibold transition-all duration-200 h-auto px-3 py-1
              ${isFollowing
                ? "bg-purple-100 border-purple-200 text-purple-800 hover:bg-purple-200"
                : "bg-purple-100 text-purple-500 border-purple-200 hover:bg-purple-200"}
              ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
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
            {label === "Following" && <Check className="w-4 h-4 text-purple-800" aria-hidden="true" />}
            <span>{label}</span>
          </motion.span>
        </AnimatePresence>
      </Button>


    );
};

export default FollowButton;
