"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
