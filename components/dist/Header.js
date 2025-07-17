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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var badge_1 = require("@/components/ui/badge");
var logo_1 = require("@/components/logo");
var use_sound_effects_1 = require("@/hooks/use-sound-effects");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var navItems = [
    { icon: lucide_react_1.Home, label: "Home" },
    { icon: lucide_react_1.Compass, label: "Explore" },
    { icon: lucide_react_1.User, label: "Profile" },
];
var supportItems = [
    { icon: lucide_react_1.HelpCircle, label: "Help" },
    { icon: lucide_react_1.Info, label: "About" },
];
var filterCategories = {
    mood: ["Uplifting", "Melancholic", "Dreamy", "Peaceful", "Romantic", "Healing"],
    theme: ["Love", "Growth", "Beauty", "Wisdom", "Self-Discovery", "Healing"],
    style: ["Minimal", "Poetic", "Metaphorical", "Wisdom", "Raw", "Elegant"]
};
var searchPrompts = [
    "How do I find peace in chaos?",
    "Words for a broken heart",
    "Motivation for Monday morning",
    "Something about growing up",
    "Love that feels like home",
];
function Header() {
    var router = navigation_1.useRouter();
    var pathname = navigation_1.usePathname();
    var _a = use_sound_effects_1.useSoundEffects(), playSound = _a.playSound, isMuted = _a.isMuted, isInitialized = _a.isInitialized, toggleMute = _a.toggleMute;
    var _b = react_1.useState(false), isSearchFocused = _b[0], setIsSearchFocused = _b[1];
    var _c = react_1.useState(""), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = react_1.useState({
        mood: [],
        theme: [],
        style: []
    }), selectedFilters = _d[0], setSelectedFilters = _d[1];
    var searchInputRef = react_1.useRef(null);
    // Smart show/hide on scroll (like BottomNav)
    var _e = react_1.useState(true), visible = _e[0], setVisible = _e[1];
    var lastScrollY = react_1.useRef(0);
    react_1.useEffect(function () {
        var handleScroll = function () {
            var currentY = window.scrollY;
            if (currentY < 32) {
                setVisible(true);
            }
            else if (currentY > lastScrollY.current) {
                setVisible(false); // scrolling down
            }
            else {
                setVisible(true); // scrolling up
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener("scroll", handleScroll);
        return function () { return window.removeEventListener("scroll", handleScroll); };
    }, []);
    // Close search overlay on escape key
    react_1.useEffect(function () {
        var handleEscape = function (e) {
            if (e.key === "Escape" && isSearchFocused) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return function () { return document.removeEventListener("keydown", handleEscape); };
    }, [isSearchFocused]);
    var handleButtonClick = function (soundType) {
        playSound(soundType);
    };
    var handleButtonHover = function () {
        playSound("hover");
    };
    var handleSearchFocus = function () {
        setIsSearchFocused(true);
        playSound("click");
    };
    var handleSearchClose = function () {
        setIsSearchFocused(false);
        setSearchQuery("");
        setSelectedFilters({ mood: [], theme: [], style: [] });
    };
    var handleMobileSearch = function () {
        playSound("click");
        router.push("/search");
    };
    var handleSearchSubmit = function (e) {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push("/search?q=" + encodeURIComponent(searchQuery.trim()));
            setIsSearchFocused(false);
        }
    };
    var handleFilterToggle = function (category, filter) {
        setSelectedFilters(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[category] = prev[category].includes(filter)
                ? prev[category].filter(function (f) { return f !== filter; })
                : __spreadArrays(prev[category], [filter]), _a)));
        });
    };
    // Only show back button on ink full page
    var isInkFullPage = /^\/ink\/[\w-]+$/.test(pathname || "");
    var isSearchPage = pathname === "/search";
    return (React.createElement(React.Fragment, null,
        React.createElement("header", { className: "sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 h-[73px] flex items-center justify-between transition-transform duration-300 " + (visible ? "translate-y-0" : "-translate-y-24"), role: "banner", "aria-label": "Main navigation" },
            React.createElement("div", { className: "flex items-center w-full gap-3" },
                isInkFullPage && (React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: function () { return router.back(); }, className: "mr-2 text-purple-600 hover:text-purple-700 focus-visible:ring-purple-500", title: "Back", "aria-label": "Go back" },
                    React.createElement(lucide_react_1.ArrowLeft, { className: "w-6 h-6" }))),
                React.createElement(logo_1["default"], null),
                React.createElement("div", { className: "hidden lg:flex flex-1 ml-4 relative" },
                    React.createElement("form", { onSubmit: handleSearchSubmit, className: "w-full relative" },
                        React.createElement(input_1.Input, { ref: searchInputRef, type: "text", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, onFocus: handleSearchFocus, placeholder: "Search for an inspiration...", className: "w-full pl-4 pr-10 py-2 bg-gray-100 border-0 rounded-full focus:bg-white focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus:outline-none transition-all duration-300", "aria-label": "Search for an inspiration", title: "Search for inks and inspiration", role: "searchbox", "aria-describedby": "search-description" }),
                        React.createElement(button_1.Button, { type: "submit", size: "sm", variant: "ghost", className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500" },
                            React.createElement(lucide_react_1.Search, { className: "w-4 h-4" }))),
                    React.createElement("div", { id: "search-description", className: "sr-only" }, "Search through all inks and content on Inkly")),
                React.createElement("div", { className: "lg:hidden ml-auto mr-2" },
                    React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: handleMobileSearch, onMouseEnter: handleButtonHover, className: "text-gray-600 hover:text-purple-600 focus-visible:ring-purple-500", title: "Search", "aria-label": "Open search page" },
                        React.createElement(lucide_react_1.Search, { className: "w-5 h-5" }))),
                React.createElement("div", { className: "flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-0", role: "group", "aria-label": "Account actions" },
                    React.createElement(button_1.Button, { className: "px-4 py-2 flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white border border-purple-600", "aria-label": "Create Ink", title: "Create new ink", onMouseEnter: handleButtonHover, onClick: function () { return handleButtonClick("click"); } },
                        React.createElement(lucide_react_1.Plus, { className: "w-4 h-4", "aria-hidden": "true" }),
                        React.createElement("span", { className: "text-xs md:text-sm lg:text-base" }, "Create")),
                    React.createElement(button_1.Button, { variant: "outline", className: "px-2 py-2 text-sm ml-1 flex items-center gap-2 rounded-full bg-transparent", "aria-label": "Join Inkly", title: "Join Inkly community", onMouseEnter: handleButtonHover, onClick: function () { return handleButtonClick("follow"); } },
                        React.createElement(lucide_react_1.UserPlus, { className: "w-4 h-4", "aria-hidden": "true" }),
                        React.createElement("span", { className: "text-xs md:text-sm lg:text-base" }, "Join"))))),
        React.createElement(framer_motion_1.AnimatePresence, null, isSearchFocused && (React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm", onClick: handleSearchClose },
            React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl", onClick: function (e) { return e.stopPropagation(); } },
                React.createElement("div", { className: "max-w-4xl mx-auto px-6 py-6" },
                    React.createElement("div", { className: "flex items-center justify-between mb-6" },
                        React.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, "Search Inkly"),
                        React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: handleSearchClose, className: "text-gray-500 hover:text-gray-700" },
                            React.createElement(lucide_react_1.X, { className: "w-5 h-5" }))),
                    React.createElement("form", { onSubmit: handleSearchSubmit, className: "relative mb-6" },
                        React.createElement(lucide_react_1.Search, { className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }),
                        React.createElement(input_1.Input, { value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, placeholder: "What are you feeling today?", className: "pl-12 pr-4 py-4 text-lg bg-white border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500", autoFocus: true })),
                    React.createElement("div", { className: "space-y-4 mb-6" }, Object.entries(filterCategories).map(function (_a) {
                        var category = _a[0], filters = _a[1];
                        return (React.createElement("div", { key: category, className: "flex items-center gap-3" },
                            React.createElement("span", { className: "text-sm font-medium text-gray-600 capitalize min-w-[60px]" },
                                category,
                                ":"),
                            React.createElement("div", { className: "flex gap-2 overflow-x-auto pb-1" }, filters.slice(0, 4).map(function (filter) { return (React.createElement(badge_1.Badge, { key: filter, variant: selectedFilters[category].includes(filter) ? "default" : "outline", className: "cursor-pointer whitespace-nowrap transition-all duration-200 " + (selectedFilters[category].includes(filter)
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                                    : "hover:bg-purple-50 hover:border-purple-300"), onClick: function () { return handleFilterToggle(category, filter); } }, filter)); }))));
                    })),
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-sm font-medium text-gray-600 mb-3" }, "Popular searches:"),
                        React.createElement("div", { className: "flex flex-wrap gap-2" }, searchPrompts.slice(0, 3).map(function (prompt, index) { return (React.createElement(button_1.Button, { key: index, variant: "outline", size: "sm", onClick: function () {
                                setSearchQuery(prompt);
                                router.push("/search?q=" + encodeURIComponent(prompt));
                                setIsSearchFocused(false);
                            }, className: "bg-gray-50 hover:bg-purple-50 hover:border-purple-300 rounded-full text-sm" }, prompt)); }))),
                    React.createElement("div", { className: "flex items-center justify-between mt-6 pt-4 border-t border-gray-200" },
                        React.createElement(button_1.Button, { variant: "ghost", onClick: function () { return router.push("/search"); }, className: "text-purple-600 hover:text-purple-700" }, "Advanced Search"),
                        React.createElement("div", { className: "flex gap-2" },
                            React.createElement(button_1.Button, { variant: "outline", onClick: handleSearchClose }, "Cancel"),
                            React.createElement(button_1.Button, { type: "submit", onClick: handleSearchSubmit, className: "bg-purple-600 hover:bg-purple-700 text-white", disabled: !searchQuery.trim() }, "Search"))))))))));
}
exports["default"] = Header;
