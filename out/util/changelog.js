"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemTypes = exports.getCurrentDate = void 0;
function getCurrentDate() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}
exports.getCurrentDate = getCurrentDate;
exports.itemTypes = {
    addition: {
        singular: 'Addition',
        plural: '添加',
        header: '新增内容',
        icon: 'add',
        color: 'charts.green',
    },
    change: {
        singular: 'Change',
        plural: '更改',
        header: '作出更改',
        icon: 'edit',
        color: 'charts.blue',
    },
    fix: {
        singular: 'Fix',
        plural: '修复',
        header: '修复错误',
        icon: 'debug',
        color: 'charts.green',
    },
    removal: {
        singular: 'Removal',
        plural: '移除',
        header: '已移除内容',
        icon: 'circle-slash',
        color: 'charts.red',
    },
    docChange: {
        singular: 'Doc Change',
        plural: '文档',
        header: '文档变化',
        icon: 'book',
        color: 'charts.orange',
    },
    deprecation: {
        singular: 'Deprecation',
        plural: '不推荐',
        header: '不推荐使用功能',
        icon: 'thumbsdown',
        color: 'charts.purple',
    }
    
};
//# sourceMappingURL=changelog.js.map