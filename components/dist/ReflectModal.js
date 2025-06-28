"use client";
"use strict";
exports.__esModule = true;
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
var textarea_1 = require("@/components/ui/textarea");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var formatTimeAgo_1 = require("../utils/formatTimeAgo");
var FloatingToast_1 = require("@/components/FloatingToast");
function ReflectModal(_a) {
    var open = _a.open, onClose = _a.onClose, onRepost = _a.onRepost, onSubmit = _a.onSubmit, originalInk = _a.originalInk;
    var _b = react_1.useState(""), text = _b[0], setText = _b[1];
    var _c = react_1.useState("menu"), mode = _c[0], setMode = _c[1];
    var _d = react_1.useState(null), toastMsg = _d[0], setToastMsg = _d[1];
    var handleReflectSubmit = function () {
        if (text.trim().length > 0) {
            onSubmit(text.trim());
            setToastMsg("Your reflection is now part of the story ✨");
            setText("");
            setMode("menu");
            setTimeout(function () {
                onClose();
            }, 1200); // Delay closing so toast renders
        }
    };
    var handleRepost = function () {
        onRepost === null || onRepost === void 0 ? void 0 : onRepost();
        setToastMsg("Reposted! This Ink now echoes through your feed 🌀");
        setMode("menu");
        setTimeout(function () {
            onClose();
        }, 1200); // Same delay here too
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(dialog_1.Dialog, { open: open, onOpenChange: function () {
                setText("");
                setMode("menu");
                onClose();
            } },
            React.createElement(dialog_1.DialogContent, { className: "max-w-md rounded-2xl p-6" },
                React.createElement(dialog_1.DialogHeader, null,
                    React.createElement(dialog_1.DialogTitle, { className: "text-lg font-semibold" }, "Reflect on this Ink")),
                React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: "easeOut" }, className: "border rounded-md bg-gray-50 p-3 mb-4 text-sm shadow-sm" },
                    React.createElement("div", { className: "flex items-center justify-between mb-1 text-xs text-gray-500" },
                        React.createElement("span", { className: "font-medium" }, originalInk.author),
                        React.createElement("span", null, formatTimeAgo_1.formatTimeAgo(originalInk.timestamp))),
                    React.createElement("div", { className: "text-gray-700 whitespace-pre-wrap leading-snug" }, originalInk.content.length > 240
                        ? originalInk.content.slice(0, 240) + "…"
                        : originalInk.content)),
                mode === "menu" ? (React.createElement("div", { className: "grid gap-3" },
                    React.createElement(button_1.Button, { onClick: handleRepost, className: "w-full justify-start gap-2 text-purple-700 bg-purple-50 hover:bg-purple-100" },
                        React.createElement(lucide_react_1.Repeat, { className: "w-4 h-4" }),
                        "Inkify this Ink"),
                    React.createElement(button_1.Button, { onClick: function () { return setMode("reflect"); }, variant: "outline", className: "w-full justify-start gap-2" },
                        React.createElement(lucide_react_1.Pencil, { className: "w-4 h-4" }),
                        "Add your own reflection"))) : (React.createElement("div", { className: "grid gap-3" },
                    React.createElement(textarea_1.Textarea, { value: text, onChange: function (e) { return setText(e.target.value); }, rows: 5, placeholder: "Write your reflection..." }),
                    React.createElement(dialog_1.DialogFooter, { className: "gap-2 justify-end" },
                        React.createElement(button_1.Button, { variant: "ghost", onClick: function () { return setMode("menu"); } }, "Back"),
                        React.createElement(button_1.Button, { className: "bg-purple-600 hover:bg-purple-700 active:bg-purple-700", onClick: handleReflectSubmit, disabled: text.trim().length === 0 }, "Post Reflection")))))),
        toastMsg && (React.createElement(FloatingToast_1["default"], { key: toastMsg, message: toastMsg }))));
}
exports["default"] = ReflectModal;
