"use client";
"use strict";
exports.__esModule = true;
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var formatTimeAgo_1 = require("@/utils/formatTimeAgo");
function DraftsQueue() {
    // Mock data for drafts
    var drafts = [
        {
            id: "1",
            title: "The Future of Remote Work",
            content: "As we navigate the post-pandemic world, remote work has become more than just a temporary solution...",
            wordCount: 847,
            lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
            tags: ["remote-work", "productivity", "future"],
            status: "draft"
        },
        {
            id: "2",
            title: "Learning to Say No",
            content: "Boundaries aren't walls, they're gates with selective entry. Here's how I learned to protect my time and energy...",
            wordCount: 623,
            lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            tags: ["boundaries", "self-care", "productivity"],
            status: "draft"
        },
        {
            id: "3",
            title: "The Art of Deep Listening",
            content: "In our noisy world, the ability to truly listen has become a superpower. Here's what I've learned about...",
            wordCount: 1205,
            lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            tags: ["communication", "relationships", "mindfulness"],
            status: "draft"
        },
    ];
    var DraftCard = function (_a) {
        var item = _a.item;
        return (React.createElement(card_1.Card, { className: "group hover:shadow-md transition-all duration-200" },
            React.createElement(card_1.CardHeader, { className: "pb-3" },
                React.createElement("div", { className: "flex items-start justify-between" },
                    React.createElement("div", { className: "flex-1" },
                        React.createElement(card_1.CardTitle, { className: "text-lg font-semibold line-clamp-1 mb-2" }, item.title),
                        React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3" }, item.content),
                        React.createElement("div", { className: "flex flex-wrap gap-1 mb-3" }, item.tags.slice(0, 3).map(function (tag) { return (React.createElement(badge_1.Badge, { key: tag, variant: "secondary", className: "text-xs" }, tag)); }))))),
            React.createElement(card_1.CardContent, { className: "pt-0" },
                React.createElement("div", { className: "flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4" },
                    React.createElement("div", { className: "flex items-center gap-4" },
                        React.createElement("span", { className: "flex items-center gap-1" },
                            React.createElement(lucide_react_1.FileText, { className: "w-3 h-3" }),
                            item.wordCount,
                            " words"),
                        React.createElement("span", { className: "flex items-center gap-1" },
                            React.createElement(lucide_react_1.Clock, { className: "w-3 h-3" }),
                            "Modified ",
                            formatTimeAgo_1.formatTimeAgo(item.lastModified)))),
                React.createElement("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" },
                    React.createElement(button_1.Button, { size: "sm", variant: "outline", className: "flex-1 bg-transparent" },
                        React.createElement(lucide_react_1.Edit, { className: "w-3 h-3 mr-1" }),
                        "Edit"),
                    React.createElement(button_1.Button, { size: "sm", className: "bg-purple-600 hover:bg-purple-700" },
                        React.createElement(lucide_react_1.Send, { className: "w-3 h-3 mr-1" }),
                        "Publish"),
                    React.createElement(button_1.Button, { size: "sm", variant: "outline" },
                        React.createElement(lucide_react_1.Eye, { className: "w-3 h-3" })),
                    React.createElement(button_1.Button, { size: "sm", variant: "outline", className: "text-red-600 hover:text-red-700 bg-transparent" },
                        React.createElement(lucide_react_1.Trash2, { className: "w-3 h-3" }))))));
    };
    return (React.createElement("div", { className: "space-y-8" },
        React.createElement("div", null,
            React.createElement("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white" }, "Drafts"),
            React.createElement("p", { className: "text-gray-600 dark:text-gray-400" }, "Manage your unpublished content")),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement(card_1.Card, null,
                React.createElement(card_1.CardContent, { className: "p-4" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400" }, "Total Drafts"),
                            React.createElement("p", { className: "text-2xl font-bold" }, drafts.length)),
                        React.createElement(lucide_react_1.FileText, { className: "w-8 h-8 text-blue-500" })))),
            React.createElement(card_1.Card, null,
                React.createElement(card_1.CardContent, { className: "p-4" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400" }, "Total Words"),
                            React.createElement("p", { className: "text-2xl font-bold" }, drafts.reduce(function (acc, draft) { return acc + draft.wordCount; }, 0).toLocaleString())),
                        React.createElement(lucide_react_1.Edit, { className: "w-8 h-8 text-purple-500" }))))),
        React.createElement("div", null,
            React.createElement("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-4" },
                "Drafts (",
                drafts.length,
                ")"),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, drafts.map(function (draft) { return (React.createElement(DraftCard, { key: draft.id, item: draft })); })))));
}
exports["default"] = DraftsQueue;
