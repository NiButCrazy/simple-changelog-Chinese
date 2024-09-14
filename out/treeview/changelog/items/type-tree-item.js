"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogTypeTreeItem = void 0;
const vscode = require("vscode");
const util_1 = require("../../util");
const changelog_1 = require("../../../util/changelog");
const config_1 = require("../../../config");
class ChangelogTypeTreeItem extends vscode.TreeItem {
    constructor(changelog, version, type, items) {
        super(changelog_1.itemTypes[type].plural, vscode.TreeItemCollapsibleState.Collapsed);
        this.changelog = changelog;
        this.version = version;
        this.type = type;
        this.items = items;
        this.contextValue = 'changelog-type';
        if (items.length > 0 && (0, config_1.getConfig)('groupsOpenByDefault')) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }
        this.tooltip = new vscode.MarkdownString(items.map((x) => `- ${x}`).join('\n'));
        this.description = `(${items.length})`;
        this.iconPath = (0, util_1.getIconFromItemType)(type);
    }
}
exports.ChangelogTypeTreeItem = ChangelogTypeTreeItem;
//# sourceMappingURL=type-tree-item.js.map