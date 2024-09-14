"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItem = void 0;
const vscode = require("vscode");
const changelog_1 = require("../../../util/changelog");
const object_1 = require("../../../util/object");
const version_tree_item_1 = require("../items/version-tree-item");
async function addItem(element) {
    const { changelog, version } = element;
    let type = element.type;
    // if element is version, ask user which type the item should be
    if (element instanceof version_tree_item_1.ChangelogVersionTreeItem) {
        const selectedType = await vscode.window.showQuickPick(Object.values(changelog_1.itemTypes).map((x) => x.singular), {
            title: '选择日志类型',
        });
        if (!selectedType) {
            return;
        }
        type = (0, object_1.findKey)(changelog_1.itemTypes, 'singular', selectedType);
    }
    // ask user for item text
    const text = await vscode.window.showInputBox({
        title: '输入文本',
        placeHolder: '描述你的更新',
        ignoreFocusOut: true,
    });
    if (!text) {
        return;
    }
    // check if item already exists for the given tyoe in the current version
    if (version.items.find((x) => x.type === type && x.text === text)) {
        vscode.window.showErrorMessage('该项内容已存在，请重新输入');
    }
    // add item to version
    changelog.versions.find((x) => x.label === version.label)?.items.push({ type, text });
    // update changelog file & refresh treeview
    const success = changelog.writeToFile();
    if (success) {
        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
    }
}
exports.addItem = addItem;
//# sourceMappingURL=add-item.js.map