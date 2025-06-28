"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var tooltip_1 = require("@/components/ui/tooltip");
var framer_motion_1 = require("framer-motion");
function EchoPile(_a) {
    var users = _a.users, total = _a.total, _b = _a.poetic, poetic = _b === void 0 ? false : _b;
    var _c = react_1.useState(false), isMobile = _c[0], setIsMobile = _c[1];
    react_1.useEffect(function () {
        var check = function () { return setIsMobile(window.innerWidth < 768); };
        check();
        window.addEventListener("resize", check);
        return function () { return window.removeEventListener("resize", check); };
    }, []);
    if (total === 0)
        return null;
    var displayedUsers = users.slice(0, 3);
    var remaining = Math.max(0, total - displayedUsers.length);
    var tooltipText = displayedUsers.length === 1
        ? "Echoed by " + displayedUsers[0].name
        : "Echoed by " + displayedUsers.map(function (u) { return u.name; }).join(", ") + (remaining > 0 ? " and " + remaining + " others" : "");
    var AvatarList = (React.createElement("div", { className: "flex -space-x-1.5" }, displayedUsers.map(function (user, i) { return (React.createElement(framer_motion_1.motion.img, { key: i, initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: i * 0.08, duration: 0.3 }, src: user.avatar, alt: user.name, className: "w-5 h-5 rounded-full border-2 border-white shadow-sm object-cover" })); })));
    return (React.createElement("div", { className: "text-xs text-gray-500 cursor-default" }, isMobile ? (React.createElement("div", { className: "flex flex-col items-start gap-0.5" },
        React.createElement("div", { className: "flex items-center gap-2" },
            AvatarList,
            React.createElement("span", { className: "font-medium" },
                total,
                " Echo",
                total > 1 ? "es" : "")),
        React.createElement("span", { className: "text-[11px] text-gray-400 pl-0.5" }, tooltipText))) : (React.createElement(tooltip_1.Tooltip, null,
        React.createElement(tooltip_1.TooltipTrigger, { asChild: true },
            React.createElement("div", { className: "flex items-center gap-2" },
                AvatarList,
                React.createElement("span", { className: "font-medium" },
                    total,
                    " Echo",
                    total > 1 ? "es" : ""))),
        React.createElement(tooltip_1.TooltipContent, null, tooltipText)))));
}
exports["default"] = EchoPile;
