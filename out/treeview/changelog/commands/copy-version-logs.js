"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionCopyLogs = void 0;
const vscode = require("vscode");
const version_tree_item_1 = require("../items/version-tree-item");

const logMatch = {"addition":"添加：","change":"更改：","fix":"修复：","removal":"移除：","docChange":'文档：',"deprecation":'不推荐：'}
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
statusBarItem.text = '$(check) 复制成功';
statusBarItem.tooltip = "好害羞(*/ω＼*)";
let timer = null;

async function versionCopyLogs(element) {
    const label = element.label;
    let copy_text = ""
    if (element instanceof version_tree_item_1.ChangelogVersionTreeItem){
        element.changelog.versions.forEach(version => {
            if(version.label === label){
                version.items.forEach(item => {
                    copy_text+= logMatch[item.type] + item.text + "\n"
                })
            }
        })
    }else{
        copy_text = element.label
    }
    
    vscode.env.clipboard.writeText(copy_text.trim()).then(() => {
        clearTimeout(timer)
        
        // 显示状态栏项
        statusBarItem.show();
        timer=setTimeout(() => {statusBarItem.hide()},3000)
    }, reason => {
        vscode.window.showErrorMessage(`复制失败：${reason}`);
    });
}
exports.versionCopyLogs = versionCopyLogs;
//# sourceMappingURL=edit-item.js.map