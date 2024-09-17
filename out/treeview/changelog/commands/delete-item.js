"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = void 0;
const vscode = require("vscode");
const config_1 = require("../../../config");
async function deleteItem(element) {
    const { changelog, version, item } = element;
    // 是否弹出该项删除消息
    if (config_1.getConfig('delete.item.message')) {
        vscode.window.showInformationMessage(`你确定要删除该项：${item.text} ？`, '是的', '取消',"不再显示").then(res => {
            switch (res) {
                case "是的":
                    version.items = version.items.filter((x) => x.text !== item.text);
                    const success = changelog.writeToFile();
                    if (success) {
                        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
                    }
                    break;
                case "不再显示":
                    vscode.window.showInformationMessage("可在设置中重新启用");
                    config_1.setConfig('delete.item.message', false);
                    break;
                default:
                    break;
            }
                
        })  
        return
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