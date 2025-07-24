"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var formatTimeAgo_1 = require("@/utils/formatTimeAgo");
var formatCount_1 = require("@/utils/formatCount");
function InksOverview() {
    var _a = react_1.useState("list"), viewMode = _a[0], setViewMode = _a[1];
    // Mock data for inks
    var inks = [
        {
            id: "1",
            title: "The Art of Mindful Writing",
            content: "In a world filled with distractions, finding moments of clarity through writing has become more important than ever...",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            views: 1247,
            reactions: 89,
            bookmarks: 34,
            reflections: 12,
            tags: ["mindfulness", "writing", "creativity"],
            isPinned: true,
            trend: "up",
            readingTime: "3 min read"
        },
        {
            id: "2",
            title: "Building Better Habits",
            content: "Small changes compound over time. Here's how I transformed my daily routine and why consistency matters more than perfection...",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            views: 892,
            reactions: 67,
            bookmarks: 28,
            reflections: 8,
            tags: ["habits", "productivity", "self-improvement"],
            isPinned: false,
            trend: "stable",
            readingTime: "5 min read"
        },
        {
            id: "3",
            title: "The Power of Vulnerability",
            content: "Sharing our struggles isn't weakness—it's courage. This post explores how vulnerability creates deeper connections...",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            views: 2156,
            reactions: 143,
            bookmarks: 67,
            reflections: 23,
            tags: ["vulnerability", "relationships", "growth"],
            isPinned: false,
            trend: "up",
            readingTime: "4 min read"
        },
        {
            id: "4",
            title: "Digital Minimalism Journey",
            content: "After 30 days of digital detox, here's what I learned about our relationship with technology and social media...",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            views: 567,
            reactions: 34,
            bookmarks: 15,
            reflections: 6,
            tags: ["minimalism", "technology", "wellness"],
            isPinned: false,
            trend: "down",
            readingTime: "6 min read"
        },
    ];
    var getTrendIcon = function (trend) {
        switch (trend) {
            case "up":
                return React.createElement(lucide_react_1.TrendingUp, { className: "w-3 h-3 text-green-500" });
            case "down":
                return React.createElement(lucide_react_1.TrendingDown, { className: "w-3 h-3 text-red-500" });
            default:
                return React.createElement(lucide_react_1.Minus, { className: "w-3 h-3 text-gray-400" });
        }
    };
    var CompactInkCard = function (_a) {
        var ink = _a.ink;
        return (React.createElement(card_1.Card, { className: "group hover:shadow-md transition-all duration-200 border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" },
            React.createElement(card_1.CardContent, { className: "p-4" },
                React.createElement("div", { className: "flex items-start justify-between gap-4" },
                    React.createElement("div", { className: "flex-1 min-w-0" },
                        React.createElement("div", { className: "flex items-center gap-2 mb-2" },
                            React.createElement("h3", { className: "font-semibold text-gray-900 dark:text-white text-sm lg:text-base line-clamp-1" }, ink.title),
                            ink.isPinned && React.createElement(lucide_react_1.Pin, { className: "w-3 h-3 text-purple-500 fill-current flex-shrink-0" }),
                            getTrendIcon(ink.trend)),
                        React.createElement("p", { className: "text-xs lg:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3" }, ink.content),
                        React.createElement("div", { className: "flex flex-wrap gap-1 mb-3" },
                            ink.tags.slice(0, 2).map(function (tag) { return (React.createElement(badge_1.Badge, { key: tag, variant: "secondary", className: "text-xs px-2 py-0.5" }, tag)); }),
                            ink.tags.length > 2 && (React.createElement(badge_1.Badge, { variant: "outline", className: "text-xs px-2 py-0.5" },
                                "+",
                                ink.tags.length - 2))),
                        React.createElement("div", { className: "flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400" },
                            React.createElement("div", { className: "flex items-center gap-1" },
                                React.createElement(lucide_react_1.Calendar, { className: "w-3 h-3" }),
                                React.createElement("span", null, formatTimeAgo_1.formatTimeAgo(ink.createdAt))),
                            React.createElement("div", { className: "flex items-center gap-1" },
                                React.createElement(lucide_react_1.Clock, { className: "w-3 h-3" }),
                                React.createElement("span", null, ink.readingTime)))),
                    React.createElement("div", { className: "flex flex-col items-end gap-2 flex-shrink-0" },
                        React.createElement("div", { className: "grid grid-cols-2 gap-2 text-xs" },
                            React.createElement("div", { className: "flex items-center gap-1 text-blue-600 dark:text-blue-400" },
                                React.createElement(lucide_react_1.Eye, { className: "w-3 h-3" }),
                                React.createElement("span", { className: "font-medium" }, formatCount_1.formatCount(ink.views))),
                            React.createElement("div", { className: "flex items-center gap-1 text-red-600 dark:text-red-400" },
                                React.createElement(lucide_react_1.Heart, { className: "w-3 h-3" }),
                                React.createElement("span", { className: "font-medium" }, formatCount_1.formatCount(ink.reactions))),
                            React.createElement("div", { className: "flex items-center gap-1 text-green-600 dark:text-green-400" },
                                React.createElement(lucide_react_1.MessageCircle, { className: "w-3 h-3" }),
                                React.createElement("span", { className: "font-medium" }, formatCount_1.formatCount(ink.reflections))),
                            React.createElement("div", { className: "flex items-center gap-1 text-yellow-600 dark:text-yellow-400" },
                                React.createElement(lucide_react_1.Bookmark, { className: "w-3 h-3" }),
                                React.createElement("span", { className: "font-medium" }, formatCount_1.formatCount(ink.bookmarks)))),
                        React.createElement("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" },
                            React.createElement(button_1.Button, { size: "sm", variant: "ghost", className: "h-7 w-7 p-0" },
                                React.createElement(lucide_react_1.Edit, { className: "w-3 h-3" })),
                            React.createElement(button_1.Button, { size: "sm", variant: "ghost", className: "h-7 w-7 p-0" },
                                React.createElement(lucide_react_1.BarChart3, { className: "w-3 h-3" })),
                            React.createElement(button_1.Button, { size: "sm", variant: "ghost", className: "h-7 w-7 p-0" },
                                React.createElement(lucide_react_1.MoreHorizontal, { className: "w-3 h-3" }))))))));
    };
    var GridInkCard = function (_a) {
        var ink = _a.ink;
        return (React.createElement(card_1.Card, { className: "group hover:shadow-lg transition-all duration-200 border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" },
            React.createElement(card_1.CardHeader, { className: "pb-3" },
                React.createElement("div", { className: "flex items-start justify-between" },
                    React.createElement("div", { className: "flex-1" },
                        React.createElement("div", { className: "flex items-center gap-2 mb-2" },
                            React.createElement(card_1.CardTitle, { className: "text-base lg:text-lg font-semibold line-clamp-1" }, ink.title),
                            ink.isPinned && React.createElement(lucide_react_1.Pin, { className: "w-4 h-4 text-purple-500 fill-current" }),
                            getTrendIcon(ink.trend)),
                        React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2" }, ink.content))),
                React.createElement("div", { className: "flex flex-wrap gap-1 mt-2" }, ink.tags.slice(0, 3).map(function (tag) { return (React.createElement(badge_1.Badge, { key: tag, variant: "secondary", className: "text-xs" }, tag)); }))),
            React.createElement(card_1.CardContent, { className: "pt-0" },
                React.createElement("div", { className: "flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4" },
                    React.createElement("span", null, formatTimeAgo_1.formatTimeAgo(ink.createdAt)),
                    React.createElement("span", null, ink.readingTime)),
                React.createElement("div", { className: "grid grid-cols-2 gap-3 mb-4" },
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Eye, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" }),
                        React.createElement("span", { className: "text-sm font-medium" }, formatCount_1.formatCount(ink.views))),
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Heart, { className: "w-4 h-4 text-red-600 dark:text-red-400" }),
                        React.createElement("span", { className: "text-sm font-medium" }, formatCount_1.formatCount(ink.reactions))),
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.MessageCircle, { className: "w-4 h-4 text-green-600 dark:text-green-400" }),
                        React.createElement("span", { className: "text-sm font-medium" }, formatCount_1.formatCount(ink.reflections))),
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Bookmark, { className: "w-4 h-4 text-yellow-600 dark:text-yellow-400" }),
                        React.createElement("span", { className: "text-sm font-medium" }, formatCount_1.formatCount(ink.bookmarks)))),
                React.createElement("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" },
                    React.createElement(button_1.Button, { size: "sm", variant: "outline", className: "flex-1 bg-transparent" },
                        React.createElement(lucide_react_1.Edit, { className: "w-3 h-3 mr-1" }),
                        "Edit"),
                    React.createElement(button_1.Button, { size: "sm", variant: "outline" },
                        React.createElement(lucide_react_1.BarChart3, { className: "w-3 h-3" })),
                    React.createElement(button_1.Button, { size: "sm", variant: "outline" },
                        React.createElement(lucide_react_1.Pin, { className: "w-3 h-3" })),
                    React.createElement(button_1.Button, { size: "sm", variant: "outline", className: "text-red-600 hover:text-red-700 bg-transparent" },
                        React.createElement(lucide_react_1.Trash2, { className: "w-3 h-3" }))))));
    };
    return (React.createElement("div", { className: "space-y-4 lg:space-y-6" },
        React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" },
            React.createElement("div", null,
                React.createElement("h2", { className: "text-xl lg:text-2xl font-bold text-gray-900 dark:text-white" }, "Your Inks"),
                React.createElement("p", { className: "text-sm lg:text-base text-gray-600 dark:text-gray-400" },
                    inks.length,
                    " published \u2022 Track performance and engagement")),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(button_1.Button, { variant: viewMode === "list" ? "default" : "outline", size: "sm", onClick: function () { return setViewMode("list"); }, className: "bg-white dark:bg-gray-800" },
                    React.createElement(lucide_react_1.List, { className: "w-4 h-4" })),
                React.createElement(button_1.Button, { variant: viewMode === "grid" ? "default" : "outline", size: "sm", onClick: function () { return setViewMode("grid"); }, className: "bg-white dark:bg-gray-800" },
                    React.createElement(lucide_react_1.Grid3X3, { className: "w-4 h-4" })))),
        viewMode === "list" ? (React.createElement("div", { className: "space-y-3" }, inks.map(function (ink) { return (React.createElement(CompactInkCard, { key: ink.id, ink: ink })); }))) : (React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6" }, inks.map(function (ink) { return (React.createElement(GridInkCard, { key: ink.id, ink: ink })); })))));
}
exports["default"] = InksOverview;
