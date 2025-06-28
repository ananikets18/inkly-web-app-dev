"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ToastPortal_1 = require("./ToastPortal");
var radio_group_1 = require("@/components/ui/radio-group");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var reportReasons = [
    "Spam or misleading",
    "Hate speech or symbols",
    "Harassment or bullying",
    "Explicit or adult content",
    "False information",
    "Other",
];
function ReportModal(_a) {
    var _this = this;
    var open = _a.open, onClose = _a.onClose, inkId = _a.inkId, content = _a.content;
    var _b = react_1.useState(""), selectedReason = _b[0], setSelectedReason = _b[1];
    var _c = react_1.useState(""), customText = _c[0], setCustomText = _c[1];
    var _d = react_1.useState(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    var _e = react_1.useState(false), showToast = _e[0], setShowToast = _e[1];
    var _f = react_1.useState(false), toastVisible = _f[0], setToastVisible = _f[1];
    var _g = react_1.useState(false), shouldShake = _g[0], setShouldShake = _g[1];
    var MAX_CHARS = 350;
    var isOther = selectedReason === "Other";
    var isOverLimit = customText.length > MAX_CHARS;
    var handleSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!selectedReason)
                return [2 /*return*/];
            if (isOther && isOverLimit) {
                setShouldShake(true);
                setTimeout(function () { return setShouldShake(false); }, 500);
                return [2 /*return*/];
            }
            if (isOther && !customText.trim())
                return [2 /*return*/];
            setShowToast(true);
            setToastVisible(true);
            setIsSubmitting(true);
            setTimeout(function () {
                setToastVisible(false);
            }, 2500);
            setTimeout(function () {
                setShowToast(false);
            }, 2500);
            setTimeout(function () {
                setIsSubmitting(false);
                onClose();
                setSelectedReason("");
                setCustomText("");
            }, 800);
            return [2 /*return*/];
        });
    }); };
    react_1.useEffect(function () {
        if (showToast) {
            var timeout_1 = setTimeout(function () { return setShowToast(false); }, 3000);
            return function () { return clearTimeout(timeout_1); };
        }
    }, [showToast]);
    return (React.createElement(React.Fragment, null,
        React.createElement(dialog_1.Dialog, { open: open, onOpenChange: function (v) { return !v && onClose(); } },
            React.createElement(dialog_1.DialogContent, { onClick: function (e) { return e.stopPropagation(); }, className: "w-[92%] sm:max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-7 shadow-2xl z-[100]" },
                React.createElement(dialog_1.DialogTitle, { className: "text-xl sm:text-2xl font-semibold text-center text-zinc-900 dark:text-white mb-4" }, "Report this Ink"),
                React.createElement("p", { className: "text-sm text-center text-zinc-600 dark:text-zinc-400 mb-6" }, "Help us keep Inkly safe. Why are you reporting this?"),
                React.createElement(radio_group_1.RadioGroup, { value: selectedReason, onValueChange: setSelectedReason, className: "space-y-3" }, reportReasons.map(function (reason) { return (React.createElement("div", { key: reason, className: "flex items-center space-x-3" },
                    React.createElement(radio_group_1.RadioGroupItem, { value: reason, id: reason, className: "border-zinc-300 dark:border-zinc-600" }),
                    React.createElement(label_1.Label, { htmlFor: reason, className: "text-sm text-zinc-700 dark:text-zinc-300" }, reason))); })),
                isOther && (React.createElement("div", { className: "mt-4" },
                    React.createElement(label_1.Label, { htmlFor: "customReason", className: "block mb-2 text-sm text-zinc-700 dark:text-zinc-300" }, "Please describe the issue"),
                    React.createElement(textarea_1.Textarea, { id: "customReason", placeholder: "Describe your concern...", value: customText, onChange: function (e) {
                            if (e.target.value.length <= MAX_CHARS + 10) {
                                setCustomText(e.target.value);
                            }
                        }, className: "min-h-[100px] resize-none outline-none text-sm transition-all duration-200 bg-zinc-50 dark:bg-zinc-800 " + (isOverLimit
                            ? "border-red-500 ring-1 ring-red-500 animate-border-pulse"
                            : "border-zinc-300 dark:border-zinc-600 focus-visible:ring-zinc-500") + " " + (shouldShake ? "animate-shake" : "") }),
                    React.createElement("div", { className: "mt-1 text-right text-xs transition " + (isOverLimit
                            ? "text-red-500"
                            : customText.length > MAX_CHARS * 0.9
                                ? "text-yellow-500"
                                : "text-zinc-500 dark:text-zinc-400"), "aria-live": "polite" },
                        customText.length,
                        " / ",
                        MAX_CHARS,
                        " characters"))),
                React.createElement(button_1.Button, { onClick: handleSubmit, disabled: !selectedReason ||
                        (isOther && (!customText.trim() || isOverLimit)) ||
                        isSubmitting, className: "mt-6 w-full" }, isSubmitting ? "Reporting..." : "Submit Report"))),
        showToast && (React.createElement(ToastPortal_1["default"], null,
            React.createElement("div", { className: "fixed bottom-6 right-6 z-[9999] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 transition-opacity duration-500 " + (toastVisible ? "opacity-100" : "opacity-0") },
                React.createElement(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-green-500" }),
                React.createElement("span", { className: "text-sm text-zinc-800 dark:text-zinc-200" }, "Thanks for reporting. We\u2019ll review this Ink."))))));
}
exports["default"] = ReportModal;
