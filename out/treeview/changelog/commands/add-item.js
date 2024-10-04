"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItem = void 0;
const vscode = require("vscode");
const changelog_1 = require("../../../util/changelog");
const object_1 = require("../../../util/object");
const version_tree_item_1 = require("../items/version-tree-item");
const config_1 = require("../../../config");

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0); //  初始化状态栏
let timer = null; //定时器初始化

// 添加了一键添加多更新消息的功能，并支持直接提交Git
async function addItem(element) {
    statusBarItem.hide()
    statusBarItem.text = '$(sync~spin) Git 提交中';
    clearTimeout(timer)
    let { changelog, version } = element;
    let type = element.type;
    // if element is version, ask user which type the item should be
    if (element instanceof version_tree_item_1.ChangelogVersionTreeItem) {
        const panel = vscode.window.createWebviewPanel(
            'addChangelog',
            '添加日志: '+version.label+'',
            vscode.ViewColumn.One,
            {
                enableScripts: true, // 允许执行 JavaScript
                retainContextWhenHidden: true
            }
        );
        panel.iconPath = {
            light: vscode.Uri.file(vscode.myExtensionPath+"/assets/icon/editlog-light.svg"),
            dark: vscode.Uri.file(vscode.myExtensionPath+"/assets/icon/editlog-dark.svg")
        }
        vscode.Uri.file(vscode.myExtensionPath+"/assets/icon/loading.svg")
        // HTML 内容
        panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>时间: ${version.date}</title>
                <style>
                    @keyframes loading {
                        0% {
                            transform: rotate(0deg);
                        }
                        50% {
                            transform: rotate(180deg);
                        }
                        
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    body {
                        font-family: Microsoft YaHei,sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    #changelog-input {
                        background-color: var(--vscode-input-background);
                        border: 1px solid var(--vscode-input-border);
                        color: var(--vscode-input-foreground);
                        width: calc(100% - 65px);
                        height: 300px;
                        font-family: Microsoft YaHei,sans-serif;
                        font-size: 15px;
                        border-radius: 3px;
                        margin: 20px;
                        margin-bottom: 10px;
                        padding: 10px;
                    }
                    #changelog-input.empty {
                        border: 1px solid red;
                    }
                    #changelog-input:focus {
                        outline-color:var(--vscode-focusBorder);
                    }
                    .btn{
                        display: inline-block;
                        width: 100px;
                        height: 30px;
                        border-radius: 2px;
                        text-align: center;
                        text-decoration: none;
                        user-select: none;
                        line-height: 30px;
                    }
                    #cancel-btn.submitting{
                        pointer-events: none;
                        opacity: 0.5;
                    }
                    #add-btn.submitting{
                        pointer-events: none;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        animation: loading 1s linear infinite;
                    }
                    #add-btn.submitting::before{
                        content: "\\21BB";
                        margin: 0;
                        font-size: 15px;
                    }
                    #add-btn{
                        width: 150px;
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        margin-left: 20px;
                        user-select: none;
                        transition: all 0.2s,background-color 0s;
                    }
                    #add-btn:hover{
                        background-color: var(--vscode-button-hoverBackground);
                    }
                    #add-btn::before{
                        content: "\\2714";
                        margin-right: 5px;
                        
                    }
                    #submit-checkbox{
                        color: var(--vscode-button-foreground);
                        margin: 5px;
                        margin-left: 10px;
                        position: relative;
                        outline: none;
                        appearance: none;
                    }
                    #gitHead-checkbox{
                        color: var(--vscode-button-foreground);
                        outline: none;
                        appearance: none;
                        margin: 5px;
                        margin-left: 7px;
                    }
                    #submit-checkbox:hover{
                        cursor: pointer;
                    }
                    label:hover{
                        cursor: pointer;
                        opacity: 0.7;
                    }
                    #cancel-btn{
                        right: 25px;
                        position: absolute;
                        color: var(--vscode-button-secondaryForeground); 
                        background-color: var(--vscode-button-secondaryBackground);
                        border: 1px solid var(--vscode-button-border, transparent);
                    }
                    #cancel-btn:hover{
                        background-color: var(--vscode-button-secondaryHoverBackground);
                    }
                    input[type="checkbox"]::before{
                        content: "\\2716";
                        color:red;
                        
                    }
                    input[type="checkbox"]:checked::before {
                        content: "\\2714"; 
                        color:green;
                    }
                </style>
                
            </head>
            <body>
                <textarea id="changelog-input"}' placeholder="文本框可以输入任何消息，其中想要转换为日志内容的格式为：\n\n( 添加 | 更改 | 修复 | 移除 | 文档 | 不推荐 ) + ( 中文符号 )：+ ( 日志消息 )\n例如 → 添加：Simple Changelog 汉化版 添加了Git提交功能\n\nGit 提交：添加日志的同时执行 Git提交 命令\n消息头修饰：第一行内容作为消息头，在行尾添加本次提交的各类型日志数量"></textarea><br>
                <a onclick="addText()" id="add-btn" class="btn">添加</a>
                <input type = "checkbox"  id = "submit-checkbox" onclick="gitEnabled(this)"><label for="submit-checkbox" style = "user-select: none;" >Git 提交</label>
                <input type = "checkbox"  id = "gitHead-checkbox" onclick="headEnabled(this)"><label for="gitHead-checkbox" style = "user-select: none;">消息头修饰</label>
                <a onclick="cancel()" id="cancel-btn" class="btn">取消</a>
            </body>
            <script>
                    const vscode = acquireVsCodeApi()
                    const changelog_input = document.getElementById('changelog-input')
                    const submit_checkbox = document.getElementById('submit-checkbox')
                    const add_btn = document.getElementById('add-btn')
                    const cancel_btn = document.getElementById('cancel-btn')
                    const gitHead_checkbox = document.getElementById('gitHead-checkbox')
                    submit_checkbox.checked = ${config_1.getConfig('git.enable')}
                    gitHead_checkbox.checked = ${config_1.getConfig('head.enable')}
                    changelog_input.onfocus = function(e){
                        changelog_input.classList.remove('empty')
                    }
                    function addText() {
                        const text = document.getElementById('changelog-input').value
                        if(text.trim() === ''){
                            vscode.postMessage({type:'empty'});
                            changelog_input.classList.add('empty')
                            return
                        }
                        vscode.postMessage({text:text,type:'add'});
                        add_btn.classList.add('submitting')
                        cancel_btn.classList.add('submitting')
                        add_btn.innerHTML = ""
                    }
                    function cancel() {
                        const text = document.getElementById('changelog-input').value
                        vscode.postMessage({type:'cancel'});
                    }
                    function gitEnabled(self){
                        vscode.postMessage({type:'gitEnabled',enabled:self.checked});
                    }
                    function headEnabled(self){
                        vscode.postMessage({type:'headEnabled',enabled:self.checked});
                    }
                    window.addEventListener('message',msg => {
                        switch (msg.data.type) {
                            case "error":
                                add_btn.innerHTML = "添加"
                                add_btn.classList.remove('submitting')
                                cancel_btn.classList.remove('submitting')
                                break;
                            case "gitScuccess":
                                break;
                            default:
                                break;
                        }
                    })
            </script>
            </html>
        `;
        const logTypes = ["添加：","更改：","修复：","移除：","文档：","不推荐："]
        const logMatch = {"添加：":"addition","更改：":"change","修复：":"fix","移除：":"removal","文档：":'docChange',"不推荐：":'deprecation'}
        // 监听来自 Webview 的消息
        panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.type) {
                    case "add":
                        // changelog =vscode.my_provider.version_items.changelog;
                        // 专门修复在编辑多行日志时，外部修改日志导致日志覆盖的BUG
                        const label = version.label;
                        for (let index = 0; index < vscode.my_provider.version_items.length; index++) {
                            const element = vscode.my_provider.version_items[index];
                            if(element.label === label){
                                changelog = element.changelog;
                                version = element.version;
                                break
                            }
                            
                        }
                        vscode.window.setStatusBarMessage(''); //  清除其余消息
                        let text = message.text; //原始文件内容
                        let types_num = {"添加：":0,"更改：":0,"修复：":0,"移除：":0,"文档：":0,"不推荐：":0} // 记录更改数量
                        const logMessages = text.split('\n').map(x => x.trim()).filter(x => x !== '');
                        let success_num = 0; //记录成功写入日志的数量
                        logMessages.forEach(log => {
                            let log_type = log.slice(0, 3)
                            let log_content = log.slice(3)
                            if (log.slice(0, 4)==="不推荐："){
                                log_type = "不推荐："
                                log_content = log.slice(4)
                            }
                            if (logTypes.includes(log_type)){
                                const log_type_match = logMatch[log_type];
                                if (version.items.find((x) => x.type === log_type_match && x.text === log_content)) {
                                    vscode.window.showWarningMessage('[ 该项内容已存在 ] '+ log );
                                    return
                                }
                                types_num[log_type]++
                                success_num++
                                changelog.versions.find((x) => x.label === version.label)?.items.push({ "type":log_type_match, "text":log_content });
                            }
                        })
                        const success = changelog.writeToFile();
                        if (success) {
                            vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
                        }
                        
                        if (config_1.getConfig('git.enable')) {
                            statusBarItem.show()
                            const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                            const terminal = vscode.window.createTerminal({ name: 'Git 提交' });
                            const listener = vscode.window.onDidEndTerminalShellExecution( (e) => {
                                if (e.terminal == terminal){
                                    if (e.exitCode === 1){
                                        
                                        panel.webview.postMessage({type:'error'});
                                        terminal.show()
                                        listener.dispose()
                                        vscode.window.showErrorMessage("Git 提交失败，请手动执行命令 "+"（ 但 "+success_num+" 条日志已成功添加 ）");
                                        return
                                    }
                                    if (e.execution.commandLine.value == "git add ." | e.execution.commandLine.value.slice(0,13) == "git commit -m"){
                                        statusBarItem.text = "$(check) Git 提交成功"
                                        terminal.dispose();
                                        listener.dispose();
                                        vscode.window.showInformationMessage("Git 提交成功，并添加了 "+success_num+" 条日志");
                                        panel.dispose();
                                        timer = setTimeout(()=>{
                                            statusBarItem.hide()
                                        },3000)
                                    }
                                }
                                
                            })
                            try {
                                const close_listener=panel.onDidDispose(() => {
                                    terminal.dispose();
                                    close_listener.dispose()
                                })
                                if (config_1.getConfig('head.enable')){
                                    let message_head = '（ ' //消息头
                                    for(let log_type in types_num){
                                        if (types_num[log_type] > 0){
                                            message_head += log_type + types_num[log_type] + "处、"
                                        }
                                    }
                                    message_head = message_head.slice(0,-1) + " ）"
                                    let new_text = text.split('\n')
                                    if (message_head == "（ ）") {
                                        new_text[0]+= "（ 未含任何日志更新 ）"
                                    }else{
                                        new_text[0]+= message_head
                                    }
                                    text = new_text.join('\n')
                                }
                                terminal.sendText(`cd "${workspaceFolder}"`);
                                terminal.sendText(`git add .`);
                                terminal.sendText(`git commit -m "${text}"`);
                            }catch(error){
                                console.error(error)
                                panel.webview.postMessage({type:'error'});
                                terminal.show()
                                listener.dispose()
                                vscode.window.showErrorMessage("Git 提交失败，请手动执行命令。"+"（ 但 "+success_num+" 条日志已成功添加 ）");
                            };
                        }else{
                            vscode.window.showInformationMessage("已成功提交 "+success_num+" 条日志");
                            panel.dispose();
                        }
                        
                        break;
                    case "cancel":
                        panel.dispose();
                        break
                    case "gitEnabled":
                        config_1.setConfig('git.enable', message.enabled);
                        break
                    case "empty":
                        if (config_1.getConfig('empty.input.message')) {
                            vscode.window.showErrorMessage("文本框不能为空","确定","不再显示").then(res => {
                                if (res === "不再显示") {
                                    vscode.window.showInformationMessage("可在设置中重新启用");
                                    config_1.setConfig('empty.input.message', false);
                                }    
                            });
                        }
                        break
                    case "headEnabled":
                        config_1.setConfig('head.enable', message.enabled);
                        break
                    default:
                        break;
                }
            },
            undefined,
            undefined
        );
        return
        // 以下是原版日志添加消息框
        // const selectedType = await vscode.window.showQuickPick(Object.values(changelog_1.itemTypes).map((x) => x.singular), {
        //     title: '选择日志类型',
        // });
        // if (!selectedType) {
        //     return;
        // }
        // type = (0, object_1.findKey)(changelog_1.itemTypes, 'singular', selectedType);
    }
    // ask user for item text
    const text = await vscode.window.showInputBox({
        title: '输入文本',
        placeHolder: '描述你的更新',
        ignoreFocusOut: true,
    });
    if (!text) {
        return;
    }
    // check if item already exists for the given tyoe in the current version
    if (version.items.find((x) => x.type === type && x.text === text)) {
        vscode.window.showErrorMessage('该项内容已存在，请重新输入');
    }
    // add item to version
    changelog.versions.find((x) => x.label === version.label)?.items.push({ type, text });
    // update changelog file & refresh treeview
    const success = changelog.writeToFile();
    if (success) {
        vscode.commands.executeCommand('simpleChangelog.changelogs.refresh');
    }
}
exports.addItem = addItem;
//# sourceMappingURL=add-item.js.map