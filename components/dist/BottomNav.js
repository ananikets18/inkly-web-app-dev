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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var lucide_react_1 = require("lucide-react");
var use_sound_effects_1 = require("../hooks/use-sound-effects");
var react_1 = require("react");
var navigation_1 = require("next/navigation");
function BottomNav() {
    var playSound = use_sound_effects_1.useSoundEffects().playSound;
    var router = navigation_1.useRouter();
    var pathname = navigation_1.usePathname();
    // Smart show/hide on scroll
    var _a = react_1.useState(true), visible = _a[0], setVisible = _a[1];
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
    var navItems = [
        {
            icon: lucide_react_1.Home,
            label: "Home",
            id: "home",
            href: "/",
            ariaLabel: "Navigate to home page"
        },
        {
            icon: lucide_react_1.Search,
            label: "Explore",
            id: "explore",
            href: "/explore",
            ariaLabel: "Explore and discover new content"
        },
        {
            icon: lucide_react_1.Plus,
            label: "Create",
            id: "create",
            href: "/create",
            ariaLabel: "Create new ink post",
            isSpecial: true
        },
        {
            icon: lucide_react_1.Bell,
            label: "Notifications",
            id: "notifications",
            href: "/notifications",
            ariaLabel: "View your notifications"
        },
        {
            icon: lucide_react_1.Settings,
            label: "Settings",
            id: "settings",
            href: "/settings",
            ariaLabel: "Access app settings"
        },
    ];
    // Get active nav based on current pathname
    var getActiveId = function () {
        if (pathname === "/")
            return "home";
        if (pathname.startsWith("/explore"))
            return "explore";
        if (pathname.startsWith("/create"))
            return "create";
        if (pathname.startsWith("/notifications"))
            return "notifications";
        if (pathname.startsWith("/settings"))
            return "settings";
        if (pathname.startsWith("/test-nav"))
            return "home"; // For testing
        return "home";
    };
    var activeId = getActiveId();
    var handleButtonHover = function () {
        playSound("hover");
    };
    var handleButtonClick = function (item) {
        playSound("click");
        // Navigate to the route
        if (item.href) {
            router.push(item.href);
        }
        // Log for testing
        console.log("Navigating to " + item.label);
    };
    var handleKeyDown = function (event, item) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleButtonClick(item);
        }
    };
    return (React.createElement("nav", { className: "fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-[0_-4px_32px_rgba(0,0,0,0.12)] border-t border-gray-100/50 px-4 py-2 flex justify-between items-center sm:hidden transition-all duration-300 " + (visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"), role: "navigation", "aria-label": "Main navigation" }, navItems.map(function (_a) {
        var Icon = _a.icon, label = _a.label, id = _a.id, ariaLabel = _a.ariaLabel, isSpecial = _a.isSpecial, item = __rest(_a, ["icon", "label", "id", "ariaLabel", "isSpecial"]);
        return (React.createElement("button", { key: id, "aria-label": ariaLabel, className: "group relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white min-h-[44px] min-w-[44px] " + (isSpecial
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl active:scale-95"
                : activeId === id
                    ? "text-purple-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:scale-95"), onMouseEnter: handleButtonHover, onClick: function () { return handleButtonClick(__assign({ icon: Icon, label: label, id: id, ariaLabel: ariaLabel, isSpecial: isSpecial }, item)); }, onKeyDown: function (e) { return handleKeyDown(e, __assign({ icon: Icon, label: label, id: id, ariaLabel: ariaLabel, isSpecial: isSpecial }, item)); }, title: label + " - " + ariaLabel, "aria-current": activeId === id ? "page" : undefined, tabIndex: 0 },
            React.createElement(Icon, { className: "transition-all duration-200 " + (isSpecial ? "w-6 h-6" : activeId === id ? "w-5 h-5 scale-110" : "w-5 h-5 group-hover:scale-105"), "aria-hidden": "true" }),
            activeId === id && !isSpecial && (React.createElement("span", { className: "text-[10px] font-medium leading-none transition-all duration-200 mt-0.5 text-purple-600" }, label)),
            activeId === id && !isSpecial && (React.createElement("div", { className: "absolute -bottom-0.5 w-1 h-1 rounded-full bg-purple-600 transition-all duration-200", "aria-hidden": "true" })),
            !isSpecial && (React.createElement("div", { className: "absolute inset-0 rounded-xl bg-gray-100 opacity-0 group-hover:opacity-50 transition-opacity duration-200" }))));
    })));
}
exports["default"] = BottomNav;
