"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAll = exports.add = exports.ls = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * 列出模板列表
 * @date 2019-10-15
 * @export
 */
function ls() {
    const templateList = require('./data/tpl.json');
    templateList.forEach((tpl) => {
        console.log(`模板：${tpl.name}   地址：${tpl.git}`);
    });
}
exports.ls = ls;
/**
 * 添加模板
 * @date 2020-08-29
 * @export
 * @param {string} name
 * @param {string} url
 */
function add(name, url) {
    let templateList = require('./data/tpl.json');
    templateList.push({
        name: name,
        git: url
    });
    try {
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, './data/tpl.json'), JSON.stringify(templateList));
        console.log('添加成功', name, url);
    }
    catch (error) {
        console.log('添加失败', error);
    }
}
exports.add = add;
function clearAll() {
    try {
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, './data/tpl.json'), JSON.stringify([]));
        console.log('清空成功');
    }
    catch (error) {
        console.log('清空失败', error);
    }
}
exports.clearAll = clearAll;
