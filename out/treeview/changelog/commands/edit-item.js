"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editItem = void 0;
const vscode = require("vscode");
async function editItem(element) {
    const { changelog } = element;
    // ask for new item text
    const res = await vscode.window.showInputBox({
        title: '输入编辑内容',
        value: element.label?.toString(),
    });
    if (!res) {
        return;
    }
    // get version
    const version = changelog.versions.find((x) => x.label === element.version.label);
    if (!version) {
        return;
    }
    // get item
    const item = version.items.find((x) => x.type === element.item.type && x.text === element.item.text);
    if (!item) {
        return;
    }
    // update item in changelog
    item.text = res;
    // update changelog file & refresh treeview
    const success = changelog.writeToFile();
    if (success) {
        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
    }
}
exports.editItem = editItem;
//# sourceMappingURL=edit-item.js.map