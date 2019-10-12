"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = require('./data/tpl.json');
function ls() {
    data.template.forEach((tpl) => {
        console.log(`模板：${tpl.name}   地址：${tpl.git}`);
    });
}
exports.ls = ls;
