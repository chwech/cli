#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const download = require('./download');
const path = require('path');
const { caniuse, updateCaniuseVersion, fetchCaniuseDataJson } = require('./caniuse');
const tpl = require('./tpl');
const TPL_NAME = {
    'api-cloud': 'api-cloud-template'
};
commander_1.default
    .command('init <tpl> [target]')
    .description('初始化项目')
    .action((tpl, target) => {
    console.log(tpl, target);
    if (target) {
        let workspace = process.cwd();
        let dirname = path.basename(workspace);
        if (target === dirname) {
            target = '.';
        }
    }
    else {
        target = '.';
    }
    download(TPL_NAME[tpl], target)
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
            await fetchCaniuseDataJson();
            await updateCaniuseVersion();
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        caniuse(feature);
    }
});
commander_1.default
    .command('tpl')
    .description('列出现有模板列表')
    .action(() => {
    tpl.ls();
});
commander_1.default.parse(process.argv);
