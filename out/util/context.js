"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContext = exports.getContext = exports.setContextObject = void 0;
const vscode = require("vscode");
let _context;
function setContextObject(context) {
    _context = context;
}
exports.setContextObject = setContextObject;
function getContext() {
    return _context;
}
exports.getContext = getContext;
function setContext(key, value) {
    vscode.commands.executeCommand('setContext', `simpleChangelog.${key}`, value);
}
exports.setContext = setContext;
//# sourceMappingURL=context.js.map