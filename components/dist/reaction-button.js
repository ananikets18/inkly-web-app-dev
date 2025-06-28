"use client";
"use strict";
exports.__esModule = true;
exports.reactions = void 0;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var ToastPortal_1 = require("./ToastPortal");
exports.reactions = [
    {
        id: "love",
        icon: lucide_react_1.Heart,
        label: "Love",
        color: "text-pink-500",
        hoverColor: "hover:text-pink-600",
        bgColor: "hover:bg-pink-50",
        sound: "like",
        animation: { scale: 1.2, rotate: [0, -10, 10, 0] }
    },
    {
        id: "felt",
        icon: lucide_react_1.Sparkles,
        label: "Felt That",
        color: "text-purple-500",
        hoverColor: "hover:text-purple-600",
        bgColor: "hover:bg-purple-50",
        sound: "hover",
        animation: { scale: 1.3 }
    },
    {
        id: "relatable",
        icon: lucide_react_1.Smile,
        label: "Relatable",
        color: "text-yellow-600",
        hoverColor: "hover:text-yellow-700",
        bgColor: "hover:bg-yellow-50",
        sound: "click",
        animation: { scale: 1.1, rotate: [0, 5, -5, 0] }
    },
    {
        id: "haunted",
        icon: lucide_react_1.Ghost,
        label: "Haunted",
        color: "text-gray-600",
        hoverColor: "hover:text-gray-700",
        bgColor: "hover:bg-gray-50",
        sound: "hover",
        animation: { scale: 1.2, rotate: [0, -4, 4, 0] }
    },
    {
        id: "wow",
        icon: lucide_react_1.Zap,
        label: "Wow",
        color: "text-blue-500",
        hoverColor: "hover:text-blue-600",
        bgColor: "hover:bg-blue-50",
        sound: "like",
        animation: { scale: 1.25 }
    },
];
function ReactionButton(_a) {
    var onReaction = _a.onReaction, onSoundPlay = _a.onSoundPlay, _b = _a.selectedReaction, selectedReaction = _b === void 0 ? null : _b, _c = _a.reactionCount, reactionCount = _c === void 0 ? 0 : _c, _d = _a.size, size = _d === void 0 ? "md" : _d, _e = _a.variant, variant = _e === void 0 ? "ghost" : _e, _f = _a.className, className = _f === void 0 ? "" : _f;
    var _g = react_1.useState(false), showReactions = _g[0], setShowReactions = _g[1];
    var _h = react_1.useState(false), isMobile = _h[0], setIsMobile = _h[1];
    var timeoutRef = react_1.useRef(null);
    var buttonRef = react_1.useRef(null);
    var hoverRef = react_1.useRef(false);
    var cooldownRef = react_1.useRef(false);
    var _j = react_1.useState(null), toastMessage = _j[0], setToastMessage = _j[1];
    react_1.useEffect(function () {
        var updateSize = function () { return setIsMobile(window.innerWidth < 768); };
        updateSize();
        window.addEventListener("resize", updateSize);
        return function () { return window.removeEventListener("resize", updateSize); };
    }, []);
    react_1.useEffect(function () {
        if (toastMessage) {
            var timer_1 = setTimeout(function () { return setToastMessage(null); }, 1500);
            return function () { return clearTimeout(timer_1); };
        }
    }, [toastMessage]);
    var handleMouseEnter = function () {
        if (!isMobile) {
            onSoundPlay === null || onSoundPlay === void 0 ? void 0 : onSoundPlay("hover");
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
            setShowReactions(true);
        }
    };
    var handleMouseLeave = function () {
        if (!isMobile && !hoverRef.current) {
            timeoutRef.current = setTimeout(function () { return setShowReactions(false); }, 300);
        }
    };
    var handleClick = function (e) {
        e.stopPropagation();
        if (cooldownRef.current) {
            setToastMessage("Too fast! Hold on a sec.");
            return;
        }
        cooldownRef.current = true;
        setTimeout(function () {
            cooldownRef.current = false;
        }, 500);
        if (isMobile) {
            onSoundPlay === null || onSoundPlay === void 0 ? void 0 : onSoundPlay("click");
            if (selectedReaction) {
                onReaction === null || onReaction === void 0 ? void 0 : onReaction(null); // ✅ Unreact directly
                setShowReactions(false); // ✅ Close if open
            }
            else {
                setShowReactions(!showReactions); // ✅ Show modal
            }
        }
        else {
            onSoundPlay === null || onSoundPlay === void 0 ? void 0 : onSoundPlay("like");
            if (selectedReaction) {
                onReaction === null || onReaction === void 0 ? void 0 : onReaction(null); // ✅ Unreact
            }
            else {
                onReaction === null || onReaction === void 0 ? void 0 : onReaction("love"); // ✅ Default to love
            }
        }
    };
    var handleReactionSelect = function (reactionId, sound, e) {
        e.stopPropagation();
        onSoundPlay === null || onSoundPlay === void 0 ? void 0 : onSoundPlay(sound);
        if (selectedReaction === reactionId) {
            onReaction === null || onReaction === void 0 ? void 0 : onReaction(null);
        }
        else {
            onReaction === null || onReaction === void 0 ? void 0 : onReaction(reactionId);
        }
        setShowReactions(false);
    };
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            if (isMobile &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                setShowReactions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () { return document.removeEventListener("mousedown", handleClickOutside); };
    }, [isMobile]);
    var selectedReactionData = exports.reactions.find(function (r) { return r.id === selectedReaction; });
    var sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12"
    };
    var RenderedIcon = (selectedReactionData === null || selectedReactionData === void 0 ? void 0 : selectedReactionData.icon) || lucide_react_1.Heart;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "relative inline-flex items-center", onMouseEnter: function () {
                hoverRef.current = true;
                handleMouseEnter();
            }, onMouseLeave: function () {
                hoverRef.current = false;
                handleMouseLeave();
            } },
            React.createElement(button_1.Button, { ref: buttonRef, variant: variant, size: "icon", className: sizeClasses[size] + " relative " + (selectedReaction ? selectedReactionData === null || selectedReactionData === void 0 ? void 0 : selectedReactionData.color : "text-gray-500") + " transition-all duration-200 hover:scale-105 active:scale-95 " + className, onClick: handleClick },
                React.createElement(framer_motion_1.AnimatePresence, { mode: "wait", initial: false },
                    React.createElement(framer_motion_1.motion.div, { key: selectedReaction, initial: { opacity: 0, scale: 0.6, rotate: -15 }, animate: { opacity: 1, scale: 1, rotate: 0 }, exit: { opacity: 0, scale: 0.4, rotate: 15 }, transition: { duration: 0.2 } },
                        React.createElement(RenderedIcon, { className: "" + (size === "sm"
                                ? "w-3.5 h-3.5"
                                : size === "md"
                                    ? "w-4 h-4"
                                    : "w-5 h-5") })))),
            React.createElement(framer_motion_1.AnimatePresence, null, showReactions && (React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: isMobile ? -10 : 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: isMobile ? -10 : 10, scale: 0.95 }, transition: { duration: 0.2, ease: "easeOut" }, className: "absolute z-[9999] left-1/2 transform -translate-x-1/2 " + (isMobile ? "bottom-full mt-3" : "bottom-full mb-3") },
                React.createElement("div", { className: "relative bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-full px-3 py-2 flex flex-row gap-2" }, exports.reactions.map(function (reaction, index) {
                    var Icon = reaction.icon;
                    var isSelected = selectedReaction === reaction.id;
                    return (React.createElement(framer_motion_1.motion.button, { key: reaction.id, initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.05, duration: 0.15 }, className: "flex items-center justify-center rounded-full transition-all duration-200 " + reaction.color + " " + reaction.hoverColor + " " + reaction.bgColor + " " + (isSelected ? "ring-2 ring-black/10" : "") + " hover:scale-125 active:scale-95 w-10 h-10", onClick: function (e) {
                            return handleReactionSelect(reaction.id, reaction.sound, e);
                        }, title: reaction.label },
                        React.createElement(framer_motion_1.motion.div, { whileHover: {
                                scale: reaction.animation.scale,
                                rotate: reaction.animation.rotate || [0]
                            }, transition: { duration: 0.3 } },
                            React.createElement(Icon, { className: "w-5 h-5" }))));
                })),
                React.createElement("div", { className: "absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent border-b-white bottom-0" }))))),
        toastMessage && (React.createElement(ToastPortal_1["default"], null,
            React.createElement("div", { role: "status", "aria-live": "polite", className: "fixed top-16 inset-x-0 mx-auto max-w-fit z-[1000] pointer-events-none rounded-full bg-purple-600 text-white px-4 py-2 text-xs font-medium shadow-lg animate-fade-in-out" }, toastMessage)))));
}
exports["default"] = ReactionButton;
