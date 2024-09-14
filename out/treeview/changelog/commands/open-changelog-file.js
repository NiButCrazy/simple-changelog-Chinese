"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openChangelogFile = void 0;
const vscode = require("vscode");
async function openChangelogFile(element) {
    const { changelog } = element;
    const file = vscode.Uri.file(changelog.filepath);
    const doc = await vscode.workspace.openTextDocument(file);
    vscode.window.showTextDocument(doc);
}
exports.openChangelogFile = openChangelogFile;
//# sourceMappingURL=open-changelog-file.js.map