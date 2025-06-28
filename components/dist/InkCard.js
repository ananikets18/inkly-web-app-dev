"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var reaction_button_1 = require("@/components/reaction-button");
var truncate_1 = require("@/utils/truncate");
var formatCount_1 = require("@/utils/formatCount");
var BookmarkToast_1 = require("../components/BookmarkToast");
var FollowToast_1 = require("../components/FollowToast");
var FollowButton_1 = require("./FollowButton");
var MoreOptionsDropdown_1 = require("./MoreOptionsDropdown");
var ReportModal_1 = require("./ReportModal");
var ReflectModal_1 = require("./ReflectModal");
var EchoPile_1 = require("./EchoPile");
var EchoBurst_1 = require("@/components/EchoBurst");
var framer_motion_1 = require("framer-motion");
function InkCard(_a) {
    var _this = this;
    var id = _a.id, content = _a.content, author = _a.author, avatarColor = _a.avatarColor, isLong = _a.isLong, reaction = _a.reaction, readingTime = _a.readingTime, onClick = _a.onClick, onHover = _a.onHover, onReact = _a.onReact, onBookmark = _a.onBookmark, onShare = _a.onShare, onFollow = _a.onFollow, views = _a.views, reactionCount = _a.reactionCount, reflectionCount = _a.reflectionCount, bookmarkCount = _a.bookmarkCount, _b = _a.shareCount, shareCount = _b === void 0 ? 0 : _b;
    var _c = react_1.useState(false), animateBookmark = _c[0], setAnimateBookmark = _c[1];
    var _d = react_1.useState(false), bookmarked = _d[0], setBookmarked = _d[1];
    var _e = react_1.useState(false), bookmarkLocked = _e[0], setBookmarkLocked = _e[1];
    var _f = react_1.useState(null), bookmarkMessage = _f[0], setBookmarkMessage = _f[1];
    var _g = react_1.useState(false), isFollowing = _g[0], setIsFollowing = _g[1];
    var _h = react_1.useState(false), isFollowLoading = _h[0], setIsFollowLoading = _h[1];
    var _j = react_1.useState(null), isFollowIntent = _j[0], setIsFollowIntent = _j[1];
    var _k = react_1.useState(false), reportOpen = _k[0], setReportOpen = _k[1];
    var _l = react_1.useState(false), reflectOpen = _l[0], setReflectOpen = _l[1];
    var _m = react_1.useState({
        reaction: (reaction === null || reaction === void 0 ? void 0 : reaction.reaction) || null
    }), localReaction = _m[0], setLocalReaction = _m[1];
    var _o = react_1.useState(reactionCount), reactionCountLocal = _o[0], setReactionCountLocal = _o[1];
    var _p = react_1.useState(reflectionCount), reflectionCountLocal = _p[0], setReflectionCountLocal = _p[1];
    var _q = react_1.useState(bookmarkCount), bookmarkCountLocal = _q[0], setBookmarkCountLocal = _q[1];
    var _r = react_1.useState(false), showEchoAnim = _r[0], setShowEchoAnim = _r[1];
    var _s = react_1.useState(false), hasReflected = _s[0], setHasReflected = _s[1];
    var _t = react_1.useState(false), hasInkified = _t[0], setHasInkified = _t[1];
    var _u = react_1.useState(0), echoCount = _u[0], setEchoCount = _u[1];
    var hasReacted = localReaction.reaction !== null;
    var shareUrl = "https://inkly.app/?share=" + id;
    var _v = react_1.useState(null), followMessage = _v[0], setFollowMessage = _v[1];
    var echoUsers = [];
    if (hasReacted)
        echoUsers.push({ name: "You", avatar: "https://i.pravatar.cc/150?img=10" });
    if (bookmarked)
        echoUsers.push({ name: "Rakesh", avatar: "https://i.pravatar.cc/150?img=15" });
    if (hasReflected)
        echoUsers.push({ name: "Maya", avatar: "https://i.pravatar.cc/150?img=22" });
    if (hasInkified)
        echoUsers.push({ name: "Rahul", avatar: "https://i.pravatar.cc/150?img=32" });
    react_1.useEffect(function () {
        if (followMessage) {
            var timeout_1 = setTimeout(function () { return setFollowMessage(null); }, 2500);
            return function () { return clearTimeout(timeout_1); };
        }
    }, [followMessage]);
    react_1.useEffect(function () {
        var total = reactionCountLocal + bookmarkCountLocal + reflectionCountLocal + (hasInkified ? 1 : 0);
        setEchoCount(total);
    }, [reactionCountLocal, bookmarkCountLocal, reflectionCountLocal, hasInkified]);
    var triggerEchoAnim = function () {
        setShowEchoAnim(true);
        setTimeout(function () { return setShowEchoAnim(false); }, 800);
    };
    var handleReaction = function (reactionId) {
        var hadReaction = localReaction.reaction !== null;
        var willReact = reactionId !== null;
        setLocalReaction({ reaction: reactionId });
        setReactionCountLocal(function (prev) {
            return !hadReaction && willReact ? prev + 1 : hadReaction && !willReact ? Math.max(0, prev - 1) : prev;
        });
        if (!hadReaction && willReact)
            triggerEchoAnim();
        onReact === null || onReact === void 0 ? void 0 : onReact(reactionId);
    };
    var handleBookmark = function (e) {
        e.stopPropagation();
        if (bookmarkLocked)
            return;
        var next = !bookmarked;
        setBookmarkLocked(true);
        setBookmarked(next);
        setBookmarkCountLocal(function (prev) { return (next ? prev + 1 : Math.max(0, prev - 1)); });
        if (next)
            triggerEchoAnim();
        setAnimateBookmark(true);
        setBookmarkMessage(next ? "Saved to your inspirations ✨" : "Removed from bookmarks 🗂️");
        onBookmark === null || onBookmark === void 0 ? void 0 : onBookmark();
        setTimeout(function () {
            setAnimateBookmark(false);
            setBookmarkLocked(false);
        }, 800);
        setTimeout(function () { return setBookmarkMessage(null); }, 1800);
    };
    var handleFollowClick = function (e) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            e === null || e === void 0 ? void 0 : e.stopPropagation();
            if (isFollowLoading)
                return [2 /*return*/];
            setIsFollowIntent(isFollowing ? "unfollow" : "follow");
            setIsFollowLoading(true);
            setTimeout(function () {
                var newFollowState = !isFollowing;
                setIsFollowing(newFollowState);
                setIsFollowLoading(false);
                if (newFollowState) {
                    fireConfetti();
                    playFollowSound();
                    setFollowMessage("You followed " + author);
                }
                else {
                    setFollowMessage("You Unfollowed " + author + " !");
                }
                onFollow === null || onFollow === void 0 ? void 0 : onFollow();
            }, 1000);
            return [2 /*return*/];
        });
    }); };
    var fireConfetti = function () {
        Promise.resolve().then(function () { return require("canvas-confetti"); }).then(function (module) {
            var confetti = module["default"];
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        });
    };
    var playFollowSound = function () {
        var audio = new Audio("/sound/success.mp3");
        audio.play()["catch"](function () { });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "w-full bg-white rounded-xl shadow-sm px-4 py-5 mb-4", onClick: onClick },
            React.createElement("div", { className: "flex items-center justify-between mb-6" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(avatar_1.Avatar, { className: "w-8 h-8" },
                        React.createElement(avatar_1.AvatarFallback, { className: "bg-gradient-to-br " + avatarColor + " text-white text-base font-medium" }, author.split(" ").map(function (n) { return n[0]; }).join(""))),
                    React.createElement("div", { className: "flex flex-col -space-y-1" },
                        React.createElement("span", { className: "text-base font-semibold text-gray-900 flex items-center" }, author),
                        React.createElement("span", { className: "text-xs text-gray-500" }, "2h ago"))),
                React.createElement("div", { className: "flex items-center gap-0" },
                    React.createElement(FollowButton_1["default"], { onFollow: handleFollowClick, isFollowing: isFollowing, isLoading: isFollowLoading, followIntent: isFollowIntent }),
                    React.createElement(MoreOptionsDropdown_1["default"], { url: shareUrl, onShared: onShare, onReportClick: function () { return setReportOpen(true); } }))),
            React.createElement("div", { className: "line-clamp-[8] mb-4 text-[16px] text-gray-900 leading-snug whitespace-pre-line font-normal" }, truncate_1.truncate(content, isLong ? 280 : 120)),
            React.createElement("div", { className: "flex flex-wrap gap-2 mb-2 text-sm" },
                React.createElement("span", { className: "hover:text-purple-600 cursor-pointer text-purple-700" }, "#poetry"),
                React.createElement("span", { className: "hover:text-purple-600 cursor-pointer text-purple-700" }, "#mindfulness"),
                React.createElement("span", { className: "bg-purple-100 text-purple-600 font-medium px-2  py-1 rounded-full ml-auto text-xs" }, "Dreamy")),
            React.createElement("div", { className: "flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100" },
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement(reaction_button_1["default"], { onReaction: handleReaction, selectedReaction: localReaction.reaction, onSoundPlay: onHover, size: "sm" }),
                    React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: function (e) {
                            e.stopPropagation();
                            setReflectOpen(true);
                        }, onMouseEnter: onHover, className: "relative text-gray-500 hover:text-blue-600 w-8 h-8" },
                        React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 4v5h.582a10.054 10.054 0 0115.775-1.317M20 20v-5h-.582a10.054 10.054 0 01-15.775 1.317" }))),
                    React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "relative text-gray-500 hover:text-purple-600 w-8 h-8 transition-transform " + (animateBookmark ? "scale-110" : ""), onMouseEnter: onHover, onClick: handleBookmark },
                        React.createElement(lucide_react_1.Bookmark, { className: "w-4 h-4 " + (bookmarked ? "text-purple-600 fill-purple-100" : "") }))),
                React.createElement("div", { className: "flex items-center gap-3 text-xs text-gray-500" },
                    React.createElement("div", { className: "flex items-center gap-1" },
                        React.createElement(lucide_react_1.Clock, { className: "w-3 h-3" }),
                        React.createElement("span", null, readingTime.text)),
                    React.createElement("span", null, "\u2022"),
                    React.createElement("div", { className: "flex items-center gap-1" },
                        React.createElement(lucide_react_1.Eye, { className: "w-4 h-4" }),
                        React.createElement("span", null, formatCount_1.formatCount(views))))),
            echoCount > 0 && (React.createElement("div", { className: "flex items-center gap-2 text-xs text-gray-500 pt-1 pl-1" },
                React.createElement(framer_motion_1.motion.div, { className: "flex", key: echoCount, initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: "easeOut" } },
                    React.createElement(EchoPile_1["default"], { users: echoUsers, total: echoCount })),
                React.createElement(EchoBurst_1["default"], { show: showEchoAnim })))),
        React.createElement(ReflectModal_1["default"], { open: reflectOpen, onClose: function () { return setReflectOpen(false); }, onRepost: function () {
                setHasInkified(true);
                triggerEchoAnim();
                setReflectOpen(false);
            }, onSubmit: function (text) {
                setReflectionCountLocal(function (prev) { return prev + 1; });
                setHasReflected(true);
                triggerEchoAnim();
                console.log("Reflection text:", text);
            }, originalInk: { content: content, author: author, timestamp: "2h ago" } }),
        React.createElement(ReportModal_1["default"], { open: reportOpen, onClose: function () { return setReportOpen(false); }, inkId: id, content: content }),
        bookmarkMessage && React.createElement(BookmarkToast_1["default"], { message: bookmarkMessage }),
        followMessage && React.createElement(FollowToast_1["default"], { key: followMessage, message: followMessage })));
}
exports["default"] = InkCard;
