"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVersion = void 0;
const vscode = require("vscode");
const changelog_1 = require("../../../util/changelog");
async function addVersion(element) {
    const { changelog } = element;
    let label = '';
    let versionExists = false;
    do {
        // ask for new version string
        const res = await vscode.window.showInputBox({
            title: '输入新版本:',
            value: label,
        });
        if (!res) {
            return;
        }
        label = res;
        // check if version already exists
        versionExists = changelog.versions.find((x) => x.label === res) !== undefined;
        if (versionExists) {
            vscode.window.showErrorMessage('该版本已存在');
        }
    } while (versionExists);
    // add version to changelog
    const newVersion = {
        label: label,
        date: (0, changelog_1.getCurrentDate)(),
        items: [],
    };
    changelog.versions = [newVersion, ...changelog.versions];
    // update changelog file & refresh treeview
    const success = changelog.writeToFile();
    if (success) {
        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
    }
}
exports.addVersion = addVersion;
//# sourceMappingURL=add-version.js.map