"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const commands_1 = require("./commands");
const provider_1 = require("./treeview/changelog/provider");
const context_1 = require("./util/context");
const path = require("path");
function activate(context) {
    vscode.myExtensionPath = context.extensionPath
    console.log('[Simple Changelog 汉化版] 扩展已激活.');
    (0, context_1.setContextObject)(context);
    // treeview
    const provider = new provider_1.ChangelogProvider(context);
    vscode.window.createTreeView('changelog-explorer', {
        treeDataProvider: provider,
        showCollapseAll: true,
    });
    vscode.my_provider = provider
    vscode.commands.registerCommand('simpleChangelog.changelogs.refresh', () => provider.refresh());
    
    (0, commands_1.registerCommands)(context);
    // refresh treeview when config changes
    vscode.workspace.onDidChangeConfiguration((e) => {
        // only listen for config changes in simpleChangelog config
        if (e.affectsConfiguration('simpleChangelog')) {
            vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
        }
    });
    // 文件检测自动刷新更新日志
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        const work_file_name = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath , "CHANGELOG.md");
        vscode.workspace.onDidSaveTextDocument(doc => {
            if (work_file_name === doc.fileName) {
                vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
            }
        });
    }
}
exports.activate = activate;
function deactivate() {
    //
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map