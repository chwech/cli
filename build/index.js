#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const os_1 = __importDefault(require("os"));
const options_1 = require("./options");
const inquirer_1 = __importDefault(require("inquirer"));
const shelljs_1 = __importDefault(require("shelljs"));
try {
    const value = options_1.schema.validateAsync(options_1.defaultOptions);
    console.log(value);
}
catch (error) {
    console.log(error);
}
console.log(os_1.default.homedir());
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
    .action((feature) => __awaiter(void 0, void 0, void 0, function* () {
    if (feature === 'update') {
        try {
            yield caniuse_1.fetchCaniuseDataJson();
            yield caniuse_1.updateCaniuseVersion();
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        caniuse_1.caniuse(feature);
    }
}));
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
const docpub = (docPath, pubPath) => {
    shelljs_1.default.cd(path_1.default.resolve(pubPath, '..'));
    shelljs_1.default.exec('git checkout master');
    shelljs_1.default.exec('git pull');
    shelljs_1.default.cp('-Ruf', path_1.default.resolve(docPath) + '/*', path_1.default.resolve(pubPath));
    shelljs_1.default.exec('git add .');
    shelljs_1.default.exec('git commit -m "chore(release): 部署文档"');
    shelljs_1.default.exec('git push');
};
program
    .command('docpub <name>')
    .description('部署文档')
    .action((name) => {
    var _a;
    const options = options_1.loadOptions();
    const pathPair = (_a = options === null || options === void 0 ? void 0 : options.docsDirMap) === null || _a === void 0 ? void 0 : _a[name];
    if (!pathPair) {
        inquirer_1.default
            .prompt([
            /* Pass your questions in here */
            {
                type: 'input',
                name: 'docPath',
                message: '请输入打包后文档资源的路径'
            },
            {
                type: 'input',
                name: 'pubPath',
                message: '请输入部署目录路径'
            }
        ])
            .then((answers) => {
            options_1.saveOptions({
                docsDirMap: Object.assign(Object.assign({}, options_1.loadOptions().docsDirMap), { [name]: [path_1.default.resolve(answers.docPath), path_1.default.resolve(answers.pubPath)] })
            });
            docpub(answers.docPath, answers.pubPath);
        })
            .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            }
            else {
                // Something else went wrong
            }
        });
    }
    else {
        docpub(pathPair[0], pathPair[1]);
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
