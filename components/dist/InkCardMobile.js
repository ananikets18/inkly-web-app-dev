"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var reaction_button_1 = require("@/components/reaction-button");
var FollowButton_1 = require("./FollowButton");
var MoreOptionsDropdown_1 = require("./MoreOptionsDropdown");
var EchoPile_1 = require("./EchoPile");
var EchoBurst_1 = require("@/components/EchoBurst");
var ReflectModal_1 = require("./ReflectModal");
var ReportModal_1 = require("./ReportModal");
var BookmarkToast_1 = require("../components/BookmarkToast");
var formatCount_1 = require("@/utils/formatCount");
var framer_motion_1 = require("framer-motion");
function InkCardMobile(_a) {
    var id = _a.id, content = _a.content, author = _a.author, avatarColor = _a.avatarColor, isLong = _a.isLong, readingTime = _a.readingTime, views = _a.views, reaction = _a.reaction, reactionCount = _a.reactionCount, reflectionCount = _a.reflectionCount, bookmarkCount = _a.bookmarkCount, onFollow = _a.onFollow, onBookmark = _a.onBookmark, onReact = _a.onReact, onShare = _a.onShare;
    var _b = react_1.useState(false), bookmarked = _b[0], setBookmarked = _b[1];
    var _c = react_1.useState(false), isFollowing = _c[0], setIsFollowing = _c[1];
    var _d = react_1.useState(false), isFollowLoading = _d[0], setIsFollowLoading = _d[1];
    var _e = react_1.useState(false), reportOpen = _e[0], setReportOpen = _e[1];
    var _f = react_1.useState(false), reflectOpen = _f[0], setReflectOpen = _f[1];
    var _g = react_1.useState(null), bookmarkMessage = _g[0], setBookmarkMessage = _g[1];
    var _h = react_1.useState(false), showEchoAnim = _h[0], setShowEchoAnim = _h[1];
    var _j = react_1.useState({
        reaction: (reaction === null || reaction === void 0 ? void 0 : reaction.reaction) || null
    }), localReaction = _j[0], setLocalReaction = _j[1];
    var _k = react_1.useState(reactionCount), reactionCountLocal = _k[0], setReactionCountLocal = _k[1];
    var _l = react_1.useState(reflectionCount), reflectionCountLocal = _l[0], setReflectionCountLocal = _l[1];
    var _m = react_1.useState(bookmarkCount), bookmarkCountLocal = _m[0], setBookmarkCountLocal = _m[1];
    var _o = react_1.useState(false), hasReflected = _o[0], setHasReflected = _o[1];
    var _p = react_1.useState(false), hasInkified = _p[0], setHasInkified = _p[1];
    var _q = react_1.useState(0), echoCount = _q[0], setEchoCount = _q[1];
    var hasReacted = localReaction.reaction !== null;
    var hasBookmarked = bookmarked;
    var totalEchoes = formatCount_1.formatCount(echoCount);
    var shareUrl = "https://inkly.app/?share=" + id;
    var handleBookmark = function () {
        var next = !bookmarked;
        setBookmarked(next);
        setBookmarkMessage(next ? "Saved to inspirations ✨" : "Removed from bookmarks 🗂️");
        onBookmark === null || onBookmark === void 0 ? void 0 : onBookmark();
        setTimeout(function () { return setBookmarkMessage(null); }, 1800);
    };
    var handleFollowClick = function () {
        if (isFollowLoading)
            return;
        setIsFollowLoading(true);
        setTimeout(function () {
            var next = !isFollowing;
            setIsFollowing(next);
            setIsFollowLoading(false);
            onFollow === null || onFollow === void 0 ? void 0 : onFollow();
            if (next) {
                fireConfetti();
                playFollowSound();
            }
        }, 1000);
    };
    var fireConfetti = function () {
        Promise.resolve().then(function () { return require("canvas-confetti"); }).then(function (module) {
            var confetti = module["default"];
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        });
    };
    var playFollowSound = function () {
        var audio = new Audio("/sound/success.mp3");
        audio.play()["catch"](function () { });
    };
    var echoUsers = [];
    if (localReaction.reaction) {
        echoUsers.push({ name: "You", avatar: "https://i.pravatar.cc/150?img=10" });
    }
    if (bookmarked) {
        echoUsers.push({ name: "Aditi", avatar: "https://i.pravatar.cc/150?img=12" });
    }
    // For guaranteed render during dev:
    if (echoUsers.length === 0) {
        echoUsers.push({ name: "DevTest", avatar: "https://i.pravatar.cc/150?img=15" });
    }
    var triggerEchoAnim = function () {
        setShowEchoAnim(true);
        setTimeout(function () { return setShowEchoAnim(false); }, 800);
    };
    react_1.useEffect(function () {
        var total = reactionCountLocal +
            bookmarkCountLocal +
            reflectionCountLocal +
            (hasInkified ? 1 : 0);
        setEchoCount(total);
    }, [reactionCountLocal, bookmarkCountLocal, reflectionCountLocal, hasInkified]);
    return (React.createElement("div", { className: "w-full px-4 py-3 border-b border-gray-100 bg-white shadow-sm" },
        React.createElement("div", { className: "flex justify-between items-start mb-2" },
            React.createElement("div", { className: "flex gap-3 items-center" },
                React.createElement(avatar_1.Avatar, { className: "w-8 h-8" },
                    React.createElement(avatar_1.AvatarFallback, { className: "bg-gradient-to-br " + avatarColor + " text-white text-xs font-medium" }, author.split(" ").map(function (n) { return n[0]; }).join(""))),
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement("span", { className: "text-sm font-medium text-gray-900" }, author),
                    React.createElement("span", { className: "text-xs text-gray-500" }, "3h ago"))),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(FollowButton_1["default"], { onFollow: handleFollowClick, isFollowing: isFollowing, isLoading: isFollowLoading, followIntent: null }),
                React.createElement(MoreOptionsDropdown_1["default"], { url: shareUrl, onShared: onShare, onReportClick: function () { return setReportOpen(true); } }))),
        React.createElement("div", { className: "text-[15px] text-gray-900 leading-snug mb-2 whitespace-pre-line" },
            content.length > 160 ? content.slice(0, 160) + "..." : content,
            isLong && React.createElement("div", { className: "text-xs mt-1 text-purple-600 font-medium cursor-pointer" }, "Read more")),
        React.createElement("div", { className: "flex justify-between items-center text-xs text-gray-500 mb-2" },
            React.createElement("div", { className: "flex gap-2 overflow-x-auto" },
                React.createElement("span", { className: "hover:text-purple-600 cursor-pointer" }, "#poetry"),
                React.createElement("span", { className: "hover:text-purple-600 cursor-pointer" }, "#mindfulness")),
            React.createElement("span", { className: "bg-purple-100 text-purple-600 font-medium px-2 py-0.5 rounded-full text-xs" }, "Dreamy")),
        React.createElement("div", { className: "flex justify-between items-center py-1" },
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement(reaction_button_1["default"], { onReaction: function (r) {
                        setLocalReaction({ reaction: r });
                        onReact === null || onReact === void 0 ? void 0 : onReact(r);
                        triggerEchoAnim(); // Optional: for burst
                    }, selectedReaction: localReaction.reaction, size: "sm" }),
                React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: function () { return setReflectOpen(true); }, className: "text-gray-500 hover:text-blue-600" },
                    React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 4v5h.582a10.054 10.054 0 0115.775-1.317M20 20v-5h-.582a10.054 10.054 0 01-15.775 1.317" }))),
                React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: handleBookmark, className: "text-gray-500 hover:text-purple-600" },
                    React.createElement(lucide_react_1.Bookmark, { className: "w-4 h-4 " + (bookmarked ? "fill-purple-200 text-purple-600" : "") }))),
            React.createElement("div", { className: "flex items-center gap-3 text-xs text-gray-500" },
                React.createElement("div", { className: "flex items-center gap-1" },
                    React.createElement(lucide_react_1.Clock, { className: "w-3 h-3" }),
                    React.createElement("span", null, readingTime.text)),
                React.createElement("span", null, "\u2022"),
                React.createElement("div", { className: "flex items-center gap-1" },
                    React.createElement(lucide_react_1.Eye, { className: "w-3 h-3" }),
                    React.createElement("span", null, formatCount_1.formatCount(views))))),
        React.createElement("div", { className: "flex items-center gap-2 text-xs text-gray-500 mt-1" },
            React.createElement(framer_motion_1.motion.div, { className: "flex" // ✅ Ensure not hidden
                , key: echoCount, initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: "easeOut" } },
                React.createElement(EchoPile_1["default"], { users: echoUsers, total: echoCount })),
            React.createElement(EchoBurst_1["default"], { show: showEchoAnim })),
        React.createElement(ReflectModal_1["default"], { open: reflectOpen, onClose: function () { return setReflectOpen(false); }, originalInk: { content: content, author: author, timestamp: "3h ago" }, onRepost: function () { return setReflectOpen(false); }, onSubmit: function () { return setReflectOpen(false); } }),
        React.createElement(ReportModal_1["default"], { open: reportOpen, onClose: function () { return setReportOpen(false); }, inkId: id, content: content }),
        bookmarkMessage && React.createElement(BookmarkToast_1["default"], { message: bookmarkMessage })));
}
exports["default"] = InkCardMobile;
