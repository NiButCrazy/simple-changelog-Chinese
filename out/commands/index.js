"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const vscode = require("vscode");
const initialize_1 = require("./initialize");
function registerCommands(context) {
    context.subscriptions.push(vscode.commands.registerCommand('simpleChangelog.initialize', initialize_1.initialize));
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=index.js.map