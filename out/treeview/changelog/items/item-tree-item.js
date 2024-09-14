"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogItemTreeItem = void 0;
const vscode = require("vscode");
const util_1 = require("../../util");
const config_1 = require("../../../config");
class ChangelogItemTreeItem extends vscode.TreeItem {
    constructor(changelog, version, type, item) {
        super(item.text, vscode.TreeItemCollapsibleState.None);
        this.changelog = changelog;
        this.version = version;
        this.type = type;
        this.item = item;
        this.contextValue = 'changelog-item';
        this.tooltip = item.text;
        const colorEnabled = (0, config_1.getConfig)('icons.color.enabled') ?? true;
        const color = colorEnabled ? (0, util_1.getIconColorFromItemType)(type) : undefined;
        const typeIconsEnabled = (0, config_1.getConfig)('icons.item.enabled') ?? false;
        const rawIcon = (0, config_1.getConfig)('icons.item.icon') ?? 'circle-filled';
        const icon = typeIconsEnabled
            ? (0, util_1.getIconFromItemType)(type)
            : new vscode.ThemeIcon(rawIcon, color);
        this.iconPath = icon;
    }
}
exports.ChangelogItemTreeItem = ChangelogItemTreeItem;
//# sourceMappingURL=item-tree-item.js.map