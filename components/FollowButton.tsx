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
            className={`flex items-center gap-1 rounded-full border text-xs font-semibold transition-all duration-200 bg-white h-auto px-3 py-1 ${isFollowing ? "border-purple-300 text-purple-500" : "border-purple-500 text-purple-600 hover:bg-purple-50"} ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
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
            {label === "Following" && <Check className="w-4 h-4 text-purple-500" aria-hidden="true" />}
            {label}
          </motion.span>
        </AnimatePresence>
      </Button>


    );
};

export default FollowButton;
