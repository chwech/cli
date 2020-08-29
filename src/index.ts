#!/usr/bin/env node
import path from 'path'
import download from './download'
import { caniuse, updateCaniuseVersion, fetchCaniuseDataJson } from './caniuse'
import { ls, add, clearAll } from './tpl'
import { Command } from 'commander'
const program = new Command();

program
  .option('-i, --init', '初始化')
  .option('-l, --ls', '列出模板')
  .option('-e, --empty', '清空模板')

// 显示版本号
const version = require(path.resolve(__dirname, '..', 'package.json')).version
program.version(version, '-v, --version', 'chwech-cli version')

// 帮助信息
program
  .name('chwech')
  .usage('[选项] [命令]')

// 子命令
program
  .command('init <tpl> [target]')
  .description('初始化项目')
  .action((tpl: string, target: string) => {
    if (target) {
      let workspace = process.cwd()
      let dirname = path.basename(workspace)
      if (target === dirname) {
        target = '.'
      }
    } else {
      target = '.'
    }
    download(tpl, target)
      .then((target: any) => {
        console.log(target)
        console.log('初始化成功')
      })
      .catch((err: any) => {
        console.log(err)
      })
  });

program
  .command('caniuse <feature>')
  .description('caniuse查找特性支持情况')
  .action(async (feature: string) => {
    if (feature === 'update') {
      try {  
        await fetchCaniuseDataJson()
        await updateCaniuseVersion()
      } catch (error) {
        console.log(error)
      }
    } else {
      caniuse(feature)
    }
  });

program
  .command('tpl [action] [name] [url]')
  .description('列出现有项目模板列表')
  .action((action, name, url) => {
    if (action === 'add') {
      add(name, url)
    } else if (action === 'edit') {
      console.log('开发中...')
    } else {
      ls()
    }
  });

program.parse(process.argv);

// 列出模板
if (program.ls) {
  ls();
}

if (program.empty) {
  clearAll();
}