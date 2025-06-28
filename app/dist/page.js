"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var Header_1 = require("../components/Header");
var SideNav_1 = require("../components/SideNav");
var BottomNav_1 = require("../components/BottomNav");
var ResponsiveInkCard_1 = require("../components/ResponsiveInkCard");
var use_sound_effects_1 = require("../hooks/use-sound-effects");
var reading_time_1 = require("../utils/reading-time");
var reaction_button_1 = require("../components/reaction-button");
var react_masonry_css_1 = require("react-masonry-css");
var masonryBreakpoints = {
    "default": 5,
    1536: 4,
    1280: 3,
    1024: 2,
    768: 1
};
function HomePage() {
    var _a = react_1.useState(20), visibleCount = _a[0], setVisibleCount = _a[1];
    var _b = react_1.useState(false), isLoadingMore = _b[0], setIsLoadingMore = _b[1];
    var _c = react_1.useState({}), postReactions = _c[0], setPostReactions = _c[1];
    var playSound = use_sound_effects_1.useSoundEffects().playSound;
    var sampleContents = [
        "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten.",
        "I am the storm I've been waiting for.",
        "Whisper to the universe what you seek and it shall echo back tenfold.",
        "A silent affirmation each morning shaped her every decision.",
        "Hope was not a bird, but a fire quietly kept alive beneath her ribs.",
        "If pain is the price of growth, she was ready to bloom.",
        "Manifest with intention. Trust the magic in your breath.",
        "Some stories aren't written. They're felt.",
        "Every time your heart is broken, a doorway cracks open to a world full of new beginnings.",
        "She wasn't soft because life was easy. She was soft like the sea—calm on the surface but carrying storms in the deep.",
    ];
    var authorNames = ["Maya Chen", "Alex Rivera", "Jordan Kim", "Sam Taylor", "Riley Park"];
    var avatarColors = [
        "from-purple-500 to-pink-500",
        "from-blue-500 to-cyan-500",
        "from-green-500 to-teal-500",
        "from-orange-500 to-red-500",
        "from-indigo-500 to-purple-500",
    ];
    var handleButtonClick = function (type) { return playSound(type); };
    var handleButtonHover = function () { return playSound("hover"); };
    var handleReaction = function (postId, reactionId) {
        if (!reactionId)
            return;
        var selected = reaction_button_1.reactions.find(function (r) { return r.id === reactionId; });
        if (selected) {
            setPostReactions(function (prev) {
                var _a;
                var _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[postId] = {
                    reaction: reactionId,
                    count: (((_b = prev[postId]) === null || _b === void 0 ? void 0 : _b.count) || 0) + 1
                }, _a)));
            });
        }
    };
    react_1.useEffect(function () {
        var handleScroll = function () {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !isLoadingMore) {
                setIsLoadingMore(true);
                setTimeout(function () {
                    setVisibleCount(function (prev) { return prev + 10; });
                    setIsLoadingMore(false);
                }, 800);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return function () { return window.removeEventListener("scroll", handleScroll); };
    }, [isLoadingMore]);
    return (React.createElement("div", { className: "min-h-screen bg-gray-50" },
        React.createElement(Header_1["default"], null),
        React.createElement("div", { className: "flex sm:flex-row flex-col" },
            React.createElement(SideNav_1["default"], null),
            React.createElement("main", { className: "flex-1 px-2 sm:px-4 py-6" },
                React.createElement(react_masonry_css_1["default"], { breakpointCols: masonryBreakpoints, className: "my-masonry-grid", columnClassName: "my-masonry-grid_column" },
                    Array.from({ length: visibleCount }).map(function (_, idx) {
                        var content = sampleContents[idx % sampleContents.length];
                        var author = authorNames[idx % authorNames.length];
                        var isLong = idx % 3 === 0;
                        var displayContent = isLong ? content.repeat(2) : content;
                        var postReaction = postReactions[idx];
                        var readingTime = reading_time_1.calculateReadingTime(displayContent);
                        var avatarColor = avatarColors[idx % avatarColors.length];
                        return (React.createElement(ResponsiveInkCard_1["default"], { key: idx, id: idx, content: displayContent, author: author, avatarColor: avatarColor, isLong: isLong, reaction: postReaction, readingTime: readingTime, onHover: handleButtonHover, onReact: function (reactionId) { return handleReaction(idx, reactionId); }, onBookmark: function () { return handleButtonClick("bookmark"); }, onShare: function () { return handleButtonClick("click"); }, onFollow: function () { return handleButtonClick("follow"); }, shareUrl: "", bookmarkCount: 0, views: 0, reactionCount: 0, reflectionCount: 0, echoCount: 0, onClick: function () { return console.log("open modal"); } }));
                    }),
                    isLoadingMore &&
                        Array.from({ length: 4 }).map(function (_, idx) { return (React.createElement("div", { key: "skeleton-" + idx, className: "animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm" },
                            React.createElement("div", { className: "flex items-center gap-3 mb-3" },
                                React.createElement("div", { className: "w-8 h-8 bg-gray-200 rounded-full" }),
                                React.createElement("div", { className: "flex-1" },
                                    React.createElement("div", { className: "h-3 bg-gray-200 rounded w-1/2 mb-1" }),
                                    React.createElement("div", { className: "h-2 bg-gray-200 rounded w-1/3" }))),
                            React.createElement("div", { className: "h-24 bg-gray-100 rounded mb-3" }),
                            React.createElement("div", { className: "h-3 bg-gray-200 rounded w-1/3 mb-1" }),
                            React.createElement("div", { className: "h-3 bg-gray-200 rounded w-1/4" }))); })))),
        React.createElement(BottomNav_1["default"], null)));
}
exports["default"] = HomePage;
