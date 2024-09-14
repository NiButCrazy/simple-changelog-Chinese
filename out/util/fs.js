"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspacePaths = exports.getLastDirName = exports.findFiles = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
/**
 * recursively find files which match the filter
 * @param {RegExp} filter The filter the files should match
 * @param {RegExp} exclude The filter which files/directories should be excluded
 */
const findFiles = (rootPath, filter, exclude) => {
    if (!fs.existsSync(rootPath)) {
        console.log('根目录不存在');
        return [];
    }
    const matchingPaths = [];
    const files = fs.readdirSync(rootPath);
    for (const filename of files) {
        const filepath = path.join(rootPath, filename);
        if (exclude && filename.match(exclude)) {
            break;
        }
        const stat = fs.lstatSync(filepath);
        if (stat.isDirectory()) {
            matchingPaths.push(...(0, exports.findFiles)(filepath, filter, exclude));
        }
        else if (stat.isFile()) {
            if (!filter) {
                matchingPaths.push(filepath);
                break;
            }
            if (filename.match(filter)) {
                matchingPaths.push(filepath);
            }
        }
    }
    return matchingPaths;
};
exports.findFiles = findFiles;
function getLastDirName(filepath) {
    const dirname = path.dirname(filepath);
    return path.basename(dirname);
}
exports.getLastDirName = getLastDirName;
function getWorkspacePaths() {
    return vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders.map((x) => x.uri.fsPath)
        : undefined;
}
exports.getWorkspacePaths = getWorkspacePaths;
//# sourceMappingURL=fs.js.map