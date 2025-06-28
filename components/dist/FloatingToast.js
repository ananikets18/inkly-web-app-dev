"use client";
"use strict";
exports.__esModule = true;
var ToastPortal_1 = require("./ToastPortal");
var react_1 = require("react");
var launchEmojiBurst_1 = require("@/utils/launchEmojiBurst");
function FloatingToast(_a) {
    var message = _a.message, _b = _a.duration, duration = _b === void 0 ? 1800 : _b, _c = _a.className, className = _c === void 0 ? "" : _c;
    var _d = react_1.useState(true), visible = _d[0], setVisible = _d[1];
    var hasBurst = react_1.useRef(false);
    react_1.useEffect(function () {
        if (!hasBurst.current) {
            launchEmojiBurst_1.launchEmojiBurst(["✨", "🌀", "💬"]);
            hasBurst.current = true;
        }
        var timeout = setTimeout(function () { return setVisible(false); }, duration);
        return function () { return clearTimeout(timeout); };
    }, [duration]);
    if (!visible)
        return null;
    return (React.createElement(ToastPortal_1["default"], null,
        React.createElement("div", { role: "status", "aria-live": "polite", className: "fixed top-16 inset-x-0 mx-auto max-w-fit z-[1000] rounded-full bg-purple-600 text-white px-4 py-2 text-xs font-medium shadow-lg animate-fade-in-out " + className }, message)));
}
exports["default"] = FloatingToast;
