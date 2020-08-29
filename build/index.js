#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const download_1 = __importDefault(require("./download"));
const caniuse_1 = require("./caniuse");
const tpl_1 = require("./tpl");
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .option('-i, --init', '初始化')
    .option('-l, --ls', '列出模板')
    .option('-e, --empty', '清空模板');
// 显示版本号
const version = require(path_1.default.resolve(__dirname, '..', 'package.json')).version;
program.version(version, '-v, --version', 'chwech-cli version');
// 帮助信息
program
    .name('chwech')
    .usage('[选项] [命令]');
// 子命令
program
    .command('init <tpl> [target]')
    .description('初始化项目')
    .action((tpl, target) => {
    if (target) {
        let workspace = process.cwd();
        let dirname = path_1.default.basename(workspace);
        if (target === dirname) {
            target = '.';
        }
    }
    else {
        target = '.';
    }
    download_1.default(tpl, target)
        .then((target) => {
        console.log(target);
        console.log('初始化成功');
    })
        .catch((err) => {
        console.log(err);
    });
});
program
    .command('caniuse <feature>')
    .description('caniuse查找特性支持情况')
    .action(async (feature) => {
    if (feature === 'update') {
        try {
            await caniuse_1.fetchCaniuseDataJson();
            await caniuse_1.updateCaniuseVersion();
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        caniuse_1.caniuse(feature);
    }
});
program
    .command('tpl [action] [name] [url]')
    .description('列出现有项目模板列表')
    .action((action, name, url) => {
    if (action === 'add') {
        tpl_1.add(name, url);
    }
    else if (action === 'edit') {
        console.log('开发中...');
    }
    else {
        tpl_1.ls();
    }
});
program.parse(process.argv);
// 列出模板
if (program.ls) {
    tpl_1.ls();
}
if (program.empty) {
    tpl_1.clearAll();
}
