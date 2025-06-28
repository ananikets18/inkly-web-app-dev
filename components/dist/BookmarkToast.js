"use client";
"use strict";
exports.__esModule = true;
var ToastPortal_1 = require("./ToastPortal");
var react_1 = require("react");
function BookmarkToast(_a) {
    var message = _a.message;
    var _b = react_1.useState(true), visible = _b[0], setVisible = _b[1];
    react_1.useEffect(function () {
        var timeout = setTimeout(function () { return setVisible(false); }, 1800);
        return function () { return clearTimeout(timeout); };
    }, []);
    if (!visible)
        return null;
    return (React.createElement(ToastPortal_1["default"], null,
        React.createElement("div", { role: "status", "aria-live": "polite", className: "fixed top-16 inset-x-0 mx-auto max-w-fit z-[1000] rounded-full bg-purple-600 text-white px-4 py-2 text-xs font-medium shadow-lg animate-fade-in-out" }, message)));
}
exports["default"] = BookmarkToast;
