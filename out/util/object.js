"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexpFromString = exports.findKey = void 0;
function findKey(obj, key, value) {
    const v = Object.values(obj).find((x) => x[key] === value);
    const k = Object.keys(obj).find((x) => obj[x] === v);
    return k ? k : undefined;
}
exports.findKey = findKey;
function regexpFromString(value) {
    const parts = value.slice(1).split('/');
    const flags = parts[parts.length - 1];
    const pattern = parts.join('/').replace(`/${flags}`, '');
    return new RegExp(pattern, flags);
}
exports.regexpFromString = regexpFromString;
//# sourceMappingURL=object.js.map