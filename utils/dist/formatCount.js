"use strict";
exports.__esModule = true;
exports.formatCount = void 0;
function formatCount(value) {
    if (value >= 1000000)
        return (value / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (value >= 1000)
        return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return value.toString();
}
exports.formatCount = formatCount;
