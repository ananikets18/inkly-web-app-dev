'use client';
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var logo_1 = require("@/components/logo");
var use_sound_effects_1 = require("@/hooks/use-sound-effects");
function Header() {
    var router = navigation_1.useRouter();
    var _a = use_sound_effects_1.useSoundEffects(), playSound = _a.playSound, isMuted = _a.isMuted, isInitialized = _a.isInitialized, toggleMute = _a.toggleMute;
    var handleButtonClick = function (soundType) {
        playSound(soundType);
    };
    var handleButtonHover = function () {
        playSound("hover");
    };
    return (React.createElement("header", { className: "sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 h-[73px]" },
        React.createElement("div", { className: "flex items-center justify-between max-w-full" },
            React.createElement(logo_1["default"], null),
            React.createElement("div", { className: "hidden sm:flex flex-1 max-w-full mx-8" },
                React.createElement("div", { className: "relative w-full" },
                    React.createElement(input_1.Input, { type: "text", placeholder: "Search for an inspiration...", className: "w-full pl-4 pr-10 py-2 bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none" }),
                    React.createElement(lucide_react_1.Search, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }))),
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement("div", { className: "hidden" },
                    React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "text-gray-500 hover:text-gray-700", onMouseEnter: handleButtonHover, onClick: function () { return handleButtonClick("click"); } },
                        React.createElement(lucide_react_1.Search, { className: "w-6 h-6" }))),
                React.createElement(button_1.Button, { className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center gap-2", onMouseEnter: handleButtonHover, onClick: function () { return handleButtonClick("click"); } },
                    React.createElement(lucide_react_1.Plus, { className: "w-4 h-4" }),
                    React.createElement("span", { className: "hidden sm:inline" }, "Create")),
                React.createElement(button_1.Button, { variant: "outline", className: "text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-full", onClick: function () { return playSound("click"); } }, "Sign In"),
                React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "hidden w-10 h-10 text-gray-500 hover:text-gray-700 " + (!isInitialized ? "opacity-50" : ""), onClick: toggleMute, title: !isInitialized ? "Click anywhere to enable sounds" : isMuted ? "Unmute sounds" : "Mute sounds", disabled: !isInitialized }, isMuted ? React.createElement(lucide_react_1.VolumeX, { className: "w-5 h-5" }) : React.createElement(lucide_react_1.Volume2, { className: "w-5 h-5" }))))));
}
exports["default"] = Header;
