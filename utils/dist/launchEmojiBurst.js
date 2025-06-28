"use strict";
exports.__esModule = true;
exports.launchEmojiBurst = void 0;
// utils/launchEmojiBurst.ts
var canvas_confetti_1 = require("canvas-confetti");
function launchEmojiBurst(emojis) {
    emojis.forEach(function (emoji, index) {
        canvas_confetti_1["default"]({
            particleCount: 10,
            angle: 90,
            spread: 70,
            origin: { x: 0.5, y: 0.3 },
            gravity: 0.5,
            ticks: 100,
            scalar: 1.2,
            shapes: ["text"],
            zIndex: 9999,
            startVelocity: 25,
            decay: 0.9,
            disableForReducedMotion: true,
            text: emoji
        });
    });
}
exports.launchEmojiBurst = launchEmojiBurst;
