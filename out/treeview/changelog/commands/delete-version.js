"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVersion = void 0;
const vscode = require("vscode");
async function deleteVersion(element) {
    const { changelog, version } = element;
    // delete version from changelog
    changelog.versions = changelog.versions.filter((x) => x.label !== version.label);
    // update changelog file & refresh treeview
    const success = changelog.writeToFile();
    if (success) {
        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
    }
}
exports.deleteVersion = deleteVersion;
//# sourceMappingURL=delete-version.js.map