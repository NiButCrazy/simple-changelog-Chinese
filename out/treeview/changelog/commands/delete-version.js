"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVersion = void 0;
const vscode = require("vscode");
const config_1 = require("../../../config");
async function deleteVersion(element) {
    const { changelog, version } = element;
    // 是否弹出删除消息
    if (config_1.getConfig('delete.version.message')) {
        vscode.window.showInformationMessage(`你确定要删除版本 ${version.label} ？`, '是的', '取消',"不再显示").then(res => {
            switch (res) {
                case "是的":
                    changelog.versions = changelog.versions.filter((x) => x.label !== version.label);
                    const success = changelog.writeToFile();
                    if (success) {
                        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
                    }
                    break;
                case "不再显示":
                    vscode.window.showInformationMessage("可在设置中重新启用");
                    config_1.setConfig('delete.version.message', false);
                    break;
                default:
                    break;
            }
                
        })  
        return
    }
    changelog.versions = changelog.versions.filter((x) => x.label !== version.label);
    // update changelog file & refresh treeview
    const success = changelog.writeToFile();
    if (success) {
        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
    }
}
exports.deleteVersion = deleteVersion;
//# sourceMappingURL=delete-version.js.map