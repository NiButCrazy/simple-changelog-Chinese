"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogFolderTreeItem = void 0;
const vscode = require("vscode");
const fs_1 = require("../../../util/fs");
class ChangelogFolderTreeItem extends vscode.TreeItem {
    constructor(changelog) {
        const dirname = (0, fs_1.getLastDirName)(changelog.filepath);
        super(dirname, vscode.TreeItemCollapsibleState.Collapsed);
        this.changelog = changelog;
        this.contextValue = 'changelog-folder';
        this.tooltip = changelog.filepath;
        this.iconPath = vscode.ThemeIcon.Folder;
    }
}
exports.ChangelogFolderTreeItem = ChangelogFolderTreeItem;
//# sourceMappingURL=folder-tree-item.js.map