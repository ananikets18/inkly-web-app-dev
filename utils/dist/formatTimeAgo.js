"use strict";
exports.__esModule = true;
exports.formatTimeAgo = void 0;
// utils/formatTimeAgo.ts
function formatTimeAgo(date) {
    var diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60)
        return diff + "s ago";
    if (diff < 3600)
        return Math.floor(diff / 60) + "m ago";
    if (diff < 86400)
        return Math.floor(diff / 3600) + "h ago";
    return Math.floor(diff / 86400) + "d ago";
}
exports.formatTimeAgo = formatTimeAgo;
