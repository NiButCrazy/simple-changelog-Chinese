"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIconColorFromItemType = exports.getIconFromItemType = void 0;
const vscode_1 = require("vscode");
const config_1 = require("../config");
const changelog_1 = require("../util/changelog");
function getIconFromItemType(type) {
    const colorEnabled = (0, config_1.getConfig)('icons.color.enabled') ?? true;
    const color = colorEnabled ? getIconColorFromItemType(type) : undefined;
    const icon = (0, config_1.getConfig)(`icons.${type}.icon`) ?? changelog_1.itemTypes[type].icon;
    return new vscode_1.ThemeIcon(icon, color);
}
exports.getIconFromItemType = getIconFromItemType;
function getIconColorFromItemType(type) {
    const color = (0, config_1.getConfig)(`icons.${type}.color`) ?? changelog_1.itemTypes[type].color;
    return new vscode_1.ThemeColor(color);
}
exports.getIconColorFromItemType = getIconColorFromItemType;
//# sourceMappingURL=util.js.map