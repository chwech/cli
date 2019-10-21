#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const commander_1 = __importDefault(require("commander"));
const download_1 = __importDefault(require("./download"));
const caniuse_1 = require("./caniuse");
const tpl_1 = require("./tpl");
const TPL_NAME = {
    'api-cloud': 'api-cloud-template'
};
// 显示版本号
const version = require(path_1.default.resolve(__dirname, '..', 'package.json')).version;
commander_1.default.version(version, '-v, --version', 'chwech-cli version');
commander_1.default
    .command('init <tpl> [target]')
    .description('初始化项目')
    .action((tpl, target) => {
    console.log(tpl, target);
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
    download_1.default(TPL_NAME[tpl], target)
        .then((target) => {
        console.log(target);
    })
        .catch((err) => {
        console.log(err);
    });
});
commander_1.default
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
commander_1.default
    .command('tpl')
    .description('列出现有模板列表')
    .action(() => {
    tpl_1.ls();
});
commander_1.default.parse(process.argv);
