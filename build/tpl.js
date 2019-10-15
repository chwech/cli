"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 列出模板列表
 * @date 2019-10-15
 * @export
 */
function ls() {
    const data = require('./data/tpl.json');
    const templateList = data.template;
    templateList.forEach((tpl) => {
        console.log(`模板：${tpl.name}   地址：${tpl.git}`);
    });
}
exports.ls = ls;
