"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var tabs_1 = require("@/components/ui/tabs");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var InksOverview_1 = require("./InksOverview");
var AnalyticsPanel_1 = require("./AnalyticsPanel");
var DraftsQueue_1 = require("./DraftsQueue");
function InklyStudio() {
    var _a = react_1.useState("overview"), activeTab = _a[0], setActiveTab = _a[1];
    // Mock analytics data
    var analyticsData = {
        totalViews: 45672,
        totalReactions: 3421,
        totalReflections: 892,
        totalBookmarks: 1567,
        followers: 2341,
        viewsGrowth: 12.5,
        reactionsGrowth: 8.3,
        reflectionsGrowth: 15.2,
        bookmarksGrowth: 6.7,
        followersGrowth: 9.1
    };
    var quickStats = [
        {
            label: "Total Views",
            value: analyticsData.totalViews.toLocaleString(),
            growth: analyticsData.viewsGrowth,
            icon: lucide_react_1.Eye,
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            label: "Reactions",
            value: analyticsData.totalReactions.toLocaleString(),
            growth: analyticsData.reactionsGrowth,
            icon: lucide_react_1.Heart,
            color: "text-red-600 dark:text-red-400"
        },
        {
            label: "Reflections",
            value: analyticsData.totalReflections.toLocaleString(),
            growth: analyticsData.reflectionsGrowth,
            icon: lucide_react_1.MessageCircle,
            color: "text-green-600 dark:text-green-400"
        },
        {
            label: "Bookmarks",
            value: analyticsData.totalBookmarks.toLocaleString(),
            growth: analyticsData.bookmarksGrowth,
            icon: lucide_react_1.Bookmark,
            color: "text-yellow-600 dark:text-yellow-400"
        },
        {
            label: "Followers",
            value: analyticsData.followers.toLocaleString(),
            growth: analyticsData.followersGrowth,
            icon: lucide_react_1.Users,
            color: "text-purple-600 dark:text-purple-400"
        },
    ];
    return (React.createElement("div", { className: "flex-1 p-4 lg:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen" },
        React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white" }, "Inkly Studio"),
                React.createElement("p", { className: "text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1" }, "Track your content performance and grow your audience")),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "bg-white dark:bg-gray-800" },
                    React.createElement(lucide_react_1.Download, { className: "w-4 h-4 mr-2" }),
                    "Export"))),
        React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4" }, quickStats.map(function (stat, index) { return (React.createElement(card_1.Card, { key: index, className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50" },
            React.createElement(card_1.CardContent, { className: "p-3 lg:p-4" },
                React.createElement("div", { className: "flex items-center justify-between mb-2" },
                    React.createElement(stat.icon, { className: "w-4 h-4 lg:w-5 lg:h-5 " + stat.color }),
                    React.createElement(badge_1.Badge, { variant: stat.growth > 0 ? "default" : "secondary", className: "text-xs " + (stat.growth > 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "") },
                        stat.growth > 0 ? "+" : "",
                        stat.growth,
                        "%")),
                React.createElement("div", { className: "text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mb-1" }, stat.value),
                React.createElement("div", { className: "text-xs lg:text-sm text-gray-600 dark:text-gray-400" }, stat.label)))); })),
        React.createElement(tabs_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-4" },
            React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" },
                React.createElement(tabs_1.TabsList, { className: "grid w-full sm:w-auto grid-cols-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" },
                    React.createElement(tabs_1.TabsTrigger, { value: "overview", className: "text-sm" },
                        React.createElement(lucide_react_1.BarChart3, { className: "w-4 h-4 mr-2" }),
                        React.createElement("span", { className: "hidden sm:inline" }, "Overview")),
                    React.createElement(tabs_1.TabsTrigger, { value: "analytics", className: "text-sm" },
                        React.createElement(lucide_react_1.TrendingUp, { className: "w-4 h-4 mr-2" }),
                        React.createElement("span", { className: "hidden sm:inline" }, "Analytics")),
                    React.createElement(tabs_1.TabsTrigger, { value: "drafts", className: "text-sm" },
                        React.createElement(lucide_react_1.Calendar, { className: "w-4 h-4 mr-2" }),
                        React.createElement("span", { className: "hidden sm:inline" }, "Drafts")))),
            React.createElement(tabs_1.TabsContent, { value: "overview", className: "space-y-6" },
                React.createElement(InksOverview_1["default"], null)),
            React.createElement(tabs_1.TabsContent, { value: "analytics", className: "space-y-6" },
                React.createElement(AnalyticsPanel_1["default"], null)),
            React.createElement(tabs_1.TabsContent, { value: "drafts", className: "space-y-6" },
                React.createElement(DraftsQueue_1["default"], null)))));
}
exports["default"] = InklyStudio;
