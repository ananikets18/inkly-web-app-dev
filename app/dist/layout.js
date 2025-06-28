"use strict";
exports.__esModule = true;
exports.metadata = void 0;
require("./globals.css");
var sans_1 = require("geist/font/sans");
var tooltip_1 = require("@/components/ui/tooltip"); // ✅ Import the TooltipProvider
exports.metadata = {
    title: "Inkly - A Place",
    description: "A beautiful Pinterest-like interface for sharing thoughts and poetry",
    generator: "v0.dev"
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en" },
        React.createElement("body", { className: sans_1.GeistSans.className },
            React.createElement(tooltip_1.TooltipProvider, null, children))));
}
exports["default"] = RootLayout;
