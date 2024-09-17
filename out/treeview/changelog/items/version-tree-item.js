"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogVersionTreeItem = void 0;
const moment = require("moment");
const vscode = require("vscode");
const config_1 = require("../../../config");
class ChangelogVersionTreeItem extends vscode.TreeItem {
    constructor(changelog, version) {
        super(version.label, vscode.TreeItemCollapsibleState.Collapsed);
        this.changelog = changelog;
        this.version = version;
        this.contextValue = 'changelog-version';
        const dateFormat = (0, config_1.getConfig)('dateFormat') ?? 'YYYY-MM-DD';
        this.description = moment(version.date, 'YYYY-MM-DD').format(dateFormat);
    }

}
exports.ChangelogVersionTreeItem = ChangelogVersionTreeItem;
//# sourceMappingURL=version-tree-item.js.map