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
var InkCard_1 = require("./InkCard"); // existing desktop/tablet version
var InkCardMobile_1 = require("./InkCardMobile"); // new mobile version
function ResponsiveInkCard(props) {
    var _a = react_1.useState(false), isMobile = _a[0], setIsMobile = _a[1];
    react_1.useEffect(function () {
        var checkScreen = function () { return setIsMobile(window.innerWidth < 640); }; // Tailwind's 'sm' breakpoint
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return function () { return window.removeEventListener("resize", checkScreen); };
    }, []);
    if (isMobile) {
        return React.createElement(InkCardMobile_1["default"], __assign({}, props));
    }
    return React.createElement(InkCard_1["default"], __assign({ baseEchoCount: 0 }, props));
}
exports["default"] = ResponsiveInkCard;
