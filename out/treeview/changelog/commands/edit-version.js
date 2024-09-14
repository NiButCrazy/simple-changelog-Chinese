"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editVersion = void 0;
const vscode = require("vscode");
const changelog_1 = require("../../../util/changelog");
async function editVersion(element) {
    const { changelog } = element;
    // ask for new label
    const res = await vscode.window.showInputBox({
        title: '编辑版本标签',
        value: element.version.label,
    });
    if (!res) {
        return;
    }
    // check if version already exists
    if (changelog.versions.find((x) => x.label === res)) {
        await vscode.window.showErrorMessage('版本已存在');
        return;
    }
    // get version
    const version = changelog.versions.find((x) => x.label === element.version.label);
    if (!version) {
        return;
    }
    // update version
    version.label = res;
    version.date = (0, changelog_1.getCurrentDate)();
    // update changelog file & refresh treeview
    const success = changelog.writeToFile();
    if (success) {
        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
    }
}
exports.editVersion = editVersion;
//# sourceMappingURL=edit-version.js.map