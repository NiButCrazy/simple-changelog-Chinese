"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfig = exports.getConfig = exports.getConfiguration = void 0;
const vscode = require("vscode");
function getConfiguration() {
    return vscode.workspace.getConfiguration('simpleChangelog');
}
exports.getConfiguration = getConfiguration;
function getConfig(key) {
    let config = getConfiguration();
    return config.get(key);
}
exports.getConfig = getConfig;
function setConfig(key, value, global = false) {
    let config = getConfiguration();
    config.update(key, value, global);
}
exports.setConfig = setConfig;
//# sourceMappingURL=index.js.map