"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = void 0;
const vscode = require("vscode");
async function deleteItem(element) {
    const { changelog, version, item } = element;
    // ask the user if he wants to delete the item
    const res = await vscode.window.showErrorMessage(`你确定要删除该项？`, '是的', '取消');
    if (res !== '是的') {
        return;
    }
    // delete item from changelog
    version.items = version.items.filter((x) => x.text !== item.text);
    // update changelog file & refresh treeview
    const success = changelog.writeToFile();
    if (success) {
        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
    }
}
exports.deleteItem = deleteItem;
//# sourceMappingURL=delete-item.js.map