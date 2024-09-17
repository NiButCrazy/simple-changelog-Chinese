"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogProvider = void 0;
const vscode = require("vscode");
const changelog_1 = require("../../classes/changelog");
const folder_tree_item_1 = require("./items/folder-tree-item");
const item_tree_item_1 = require("./items/item-tree-item");
const type_tree_item_1 = require("./items/type-tree-item");
const version_tree_item_1 = require("./items/version-tree-item");
const fs_1 = require("../../util/fs");
const context_1 = require("../../util/context");
const edit_item_1 = require("./commands/edit-item");
const add_version_1 = require("./commands/add-version");
const open_changelog_file_1 = require("./commands/open-changelog-file");
const add_item_1 = require("./commands/add-item");
const delete_item_1 = require("./commands/delete-item");
const edit_version_1 = require("./commands/edit-version");
const delete_version_1 = require("./commands/delete-version");
const config_1 = require("../../config");
const object_1 = require("../../util/object");
const { versions } = require("process");
class ChangelogProvider {
    constructor(context) {
        this.filepaths = [];
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.refresh();
        this.registerCommands(context);
        this.TreeItems = []; //获取已存在的树子项，测了半天才发现getChildren返回的是新生成的树对象，怪不得每次都获取不到树状视图里的项
        this.version_items = []; //版本树项
        this.type_items = [];  //  类型树项
        this.folder_items = []; //  目录树项
        this.isAllCollapse = false;  //是否全部折叠
        this.isAllExpanded = false;  //是否全部展开
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element === undefined) {
            this.folder_items =this.filepaths.map((filepath) => new folder_tree_item_1.ChangelogFolderTreeItem(new changelog_1.Changelog(filepath)));
            return this.folder_items
        }
        if (element instanceof folder_tree_item_1.ChangelogFolderTreeItem) {
            const { changelog } = element;
            if (changelog.versions.length === 0) {
                const item = new vscode.TreeItem('', vscode.TreeItemCollapsibleState.None);
                item.description = '还未添加任何版本';
                this.version_items =[item]
                return this.version_items;
            }
            this.version_items = changelog.versions.map((v) => new version_tree_item_1.ChangelogVersionTreeItem(changelog, v));
            return this.version_items
        }
        if (element instanceof version_tree_item_1.ChangelogVersionTreeItem) {
            const { changelog, version } = element;
            const itemGroupingEnabled = (0, config_1.getConfig)('itemGrouping') ?? true;
            if (itemGroupingEnabled) {
                const additions = version.items.filter((x) => x.type === 'addition');
                const changes = version.items.filter((x) => x.type === 'change');
                const fixes = version.items.filter((x) => x.type === 'fix');
                const removals = version.items.filter((x) => x.type === 'removal');
                const docChanges = version.items.filter((x) => x.type === 'docChange');
                const deprecations = version.items.filter((x) => x.type === 'deprecation');
                this.type_items = [
                    new type_tree_item_1.ChangelogTypeTreeItem(changelog, version, 'addition', additions),
                    new type_tree_item_1.ChangelogTypeTreeItem(changelog, version, 'change', changes),
                    new type_tree_item_1.ChangelogTypeTreeItem(changelog, version, 'fix', fixes),
                    new type_tree_item_1.ChangelogTypeTreeItem(changelog, version, 'removal', removals),
                    new type_tree_item_1.ChangelogTypeTreeItem(changelog, version, 'docChange', docChanges),
                    new type_tree_item_1.ChangelogTypeTreeItem(changelog, version, 'deprecation', deprecations),
                ];
                return this.type_items
            }
            else {
                version.items.sort((a, b) => a.type.localeCompare(b.type));
                this.type_items =version.items.map((item) => new item_tree_item_1.ChangelogItemTreeItem(changelog, version, item.type, item));
                return this.type_items
            }
        }
        if (element instanceof type_tree_item_1.ChangelogTypeTreeItem) {
            const { changelog, version, type } = element;
            this.TreeItems = element.items.map((item) => new item_tree_item_1.ChangelogItemTreeItem(changelog, version, type, item));
            return this.TreeItems
        }
    }
    //打开设置
    open_setting(self){
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:nibutcrazy.vscode-simple-changelog-chinese ');
    }
    //全部折叠
    collapse_all(self) {

    }
    //全部展开
    expand_all(self) {

    }
    registerCommands(context) {
        context.subscriptions.push(vscode.commands.registerCommand('simpleChangelog.changelogs.openChangelogFile', open_changelog_file_1.openChangelogFile), vscode.commands.registerCommand('simpleChangelog.changelogs.addVersion', add_version_1.addVersion), vscode.commands.registerCommand('simpleChangelog.changelogs.editVersion', edit_version_1.editVersion), vscode.commands.registerCommand('simpleChangelog.changelogs.deleteVersion', delete_version_1.deleteVersion), vscode.commands.registerCommand('simpleChangelog.changelogs.addItem', add_item_1.addItem), vscode.commands.registerCommand('simpleChangelog.changelogs.editItem', edit_item_1.editItem), vscode.commands.registerCommand('simpleChangelog.changelogs.deleteItem', delete_item_1.deleteItem),vscode.commands.registerCommand('simpleChangelog.setting.open', this.open_setting));
    }
    refresh() {
        const workspaces = (0, fs_1.getWorkspacePaths)();
        if (!workspaces) {
            this.filepaths = [];
            this._onDidChangeTreeData.fire();
            (0, context_1.setContext)('initialized', false);
            return;
        }
        // find all paths where a changelog.md is present
        const includeRegex = (0, object_1.regexpFromString)((0, config_1.getConfig)('searchIncludeRegex') ?? '/changelog.md/i');
        const excludeRegex = (0, object_1.regexpFromString)((0, config_1.getConfig)('searchExcludeRegex') ?? '/node_modules/');
        const changelogPaths = workspaces.reduce((acc, workspace) => acc.concat(...(0, fs_1.findFiles)(workspace, includeRegex, excludeRegex)), []);
        // show welcome view is no changelogs found
        if (changelogPaths.length === 0) {
            this.filepaths = [];
            this._onDidChangeTreeData.fire();
            (0, context_1.setContext)('initialized', false);
            return;
        }
        // set extension to 'initialized'
        (0, context_1.setContext)('initialized', true);
        this.filepaths = changelogPaths;
        this._onDidChangeTreeData.fire();
    }
}
exports.ChangelogProvider = ChangelogProvider;
//# sourceMappingURL=provider.js.map