"use client";
"use strict";
exports.__esModule = true;
var framer_motion_1 = require("framer-motion");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var FollowButton = function (_a) {
    var onFollow = _a.onFollow, isFollowing = _a.isFollowing, isLoading = _a.isLoading, followIntent = _a.followIntent;
    var label = "Follow";
    if (isLoading) {
        if (followIntent === "unfollow")
            label = "Unfollowing...";
        else if (followIntent === "follow")
            label = "Following...";
    }
    else if (isFollowing) {
        label = "Following";
    }
    return (React.createElement(button_1.Button, { disabled: isLoading, onClick: onFollow, className: "\n              flex items-center gap-1 rounded-full border text-xs font-semibold transition-all duration-200\n              bg-white h-auto px-3 py-1\n              " + (isFollowing ? "border-purple-300 text-purple-500" : "border-purple-500 text-purple-600 hover:bg-purple-50") + "\n              " + (isLoading ? "opacity-60 cursor-not-allowed" : "") + "\n            " },
        React.createElement(framer_motion_1.AnimatePresence, { mode: "wait", initial: false },
            React.createElement(framer_motion_1.motion.span, { key: label, initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 4 }, transition: { duration: 0.2 }, className: "inline-flex items-center gap-1" },
                label === "Following" && React.createElement(lucide_react_1.Check, { className: "w-4 h-4 text-purple-500" }),
                label))));
};
exports["default"] = FollowButton;
