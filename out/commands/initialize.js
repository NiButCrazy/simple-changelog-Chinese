"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const changelog_1 = require("../classes/changelog");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const context_1 = require("../util/context");
/**
 * Create initial changelog
 */
async function initialize() {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        const workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;
        // create file `CHANGELOG.md`
        const filename = path.join(workspace, 'CHANGELOG.md');
        if (!fs.existsSync(filename)) {
            // create file
            fs.writeFileSync(filename, '', 'utf-8');
            // create changelog from created file
            const changelog = new changelog_1.Changelog(filename);
            // write changelog to file
            fs.writeFileSync(filename, changelog.toString(), 'utf-8');
        }
        // open file in editor
        const file = vscode.Uri.file(filename);
        const doc = await vscode.workspace.openTextDocument(file);
        vscode.window.showTextDocument(doc);
        // set extension to 'initialized'
        (0, context_1.setContext)('initialized', true);
        // refresh to show new changelog in tree view
        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
    }
}
exports.initialize = initialize;
//# sourceMappingURL=initialize.js.map