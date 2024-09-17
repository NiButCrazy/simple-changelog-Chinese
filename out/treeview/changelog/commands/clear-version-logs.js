"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionClearLogs = void 0;
const vscode = require("vscode");
const config_1 = require("../../../config");
const versionCopyLogs_1 = require("./copy-version-logs");

async function versionClearLogs(element) {
    const label = element.label;
    element.changelog.versions.forEach(version => {
        if(version.label === label){
            if (config_1.getConfig('clear.version.message')) {
                vscode.window.showInformationMessage(`你确定清除版本：${version.label} 的日志？（ 清除的日志会复制到剪切板 ）`,"是的","取消","不再显示").then(res => {
                    switch (res) {
                        case "是的":
                            versionCopyLogs_1.versionCopyLogs(element);
                            version.items = [];
                            const success = element.changelog.writeToFile();
                            if (success) {
                                vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
                            }
                            break
                        case "取消":
                            break
                        default:
                            config_1.setConfig('clear.version.message', false);
                            vscode.window.showInformationMessage("可在设置中重新启用");
                            break
                    }
                })
            }else{
                versionCopyLogs_1.versionCopyLogs(element);
                version.items = [];
                const success = element.changelog.writeToFile();
                if (success) {
                    vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
                }
                
            }
            
        }
    })
}
exports.versionClearLogs = versionClearLogs;