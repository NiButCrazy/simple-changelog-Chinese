"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Changelog = void 0;
const changelog_1 = require("./../util/changelog");
const fs = require("fs");
const object_1 = require("../util/object");
const config_1 = require("../config");
class Changelog {
    constructor(filepath) {
        this.filepath = filepath;
        this.versions = [];
        if (filepath && filepath !== '') {
            this.readFromFile();
        }
    }
    readFromFile() {
        if (!this.filepath || this.filepath === '') {
            return false;
        }
        const content = fs.readFileSync(this.filepath).toString();
        const changelog = Changelog.parse(content);
        this.versions = changelog.versions;
        return true;
    }
    writeToFile() {
        if (!this.filepath) {
            return false;
        }
        fs.writeFileSync(this.filepath, this.toString());
        return true;
    }
    static parse(data) {
        const changelog = new Changelog('');
        const lines = data.split('\n').map((x) => x.trim());
        let lineType = 'none';
        let itemType = undefined; // = 'none';
        for (const line of lines) {
            lineType = this.parseLineType(line);
            if (lineType === 'version') {
                const v = this.parseVersion(line);
                if (v) {
                    changelog.versions.push(v);
                }
            }
            else if (lineType === 'type') {
                itemType = this.parseItemType(line);
            }
            else if (lineType === 'item' && itemType) {
                const text = line.substring(1).trim();
                const item = { type: itemType, text };
                changelog.versions[changelog.versions.length - 1].items.push(item);
            }
        }
        return changelog;
    }
    toString() {
        const attributionPosition = (0, config_1.getConfig)('attribution.placement') ?? 'top';
        const attribution = this.getAttribution();
        let x = '# 更新日志\n\n';
        if (attributionPosition === 'top' && attribution) {
            x += `${attribution}\n\n`;
        }
        x += this.versions.map((v) => Changelog.stringifyVersion(v)).join('\n\n\n');
        if (attributionPosition === 'bottom' && attribution) {
            x += `\n\n${attribution}`;
        }
        return x.trim();
    }
    static parseLineType(line) {
        if (line.startsWith('## ')) {
            return 'version';
        }
        if ((line.startsWith('**') && line.endsWith('**')) || line.startsWith('### ')) {
            return 'type';
        }
        if (line.startsWith('- ')) {
            return 'item';
        }
        return 'none';
    }
    static parseVersion(line) {
        const match = line.match(/## \[(?<version>.+)](\s*\-\s*(?<date>\d{4}-\d{2}-\d{2}))?/);
        if (match && match.groups) {
            const { version, date } = match.groups;
            return {
                label: version,
                date: date,
                items: [],
            };
        }
    }
    static parseItemType(line) {
        const type = line.replace(/\*\*/g, '').replace(/\#{3}/g, '').trim();
        const key = (0, object_1.findKey)(changelog_1.itemTypes, 'header', type);
        return key;
    }
    static stringifyItemType(itemType) {
        return changelog_1.itemTypes[itemType].header;
    }
    static stringifyVersion(version) {
        let res = `## [${version.label}]`;
        if (version.date) {
            res += ` - ${version.date}`;
        }
        res += '\n';
        const items = [
            this.stringifyItems(version, 'addition'),
            this.stringifyItems(version, 'change'),
            this.stringifyItems(version, 'deprecation'),
            this.stringifyItems(version, 'fix'),
            this.stringifyItems(version, 'removal'),
            this.stringifyItems(version, 'securityChange'),
        ].filter((x) => !!x);
        res += items.join('\n\n');
        return res.trim();
    }
    static stringifyItems(version, itemType) {
        const items = version.items.filter((x) => x.type === itemType);
        if (items.length === 0) {
            return '';
        }
        let res = `### ${Changelog.stringifyItemType(itemType)}\n`;
        res += items.map((x) => `- ${x.text}`).join('\n');
        return res.trim();
    }
    getAttribution() {
        const type = (0, config_1.getConfig)('attribution.visibility') ?? 'visible';
        const text = `日志使用 [Simple Changelog 汉化版](https://github.com/NiButCrazy/simple-changelog-Chinese) 生成`;
        switch (type) {
            case 'visible':
                return `*${text}*`;
            case 'hidden':
                return `<!-- ${text} -->`;
            case 'none':
                return undefined;
        }
    }
}
exports.Changelog = Changelog;
//# sourceMappingURL=changelog.js.map