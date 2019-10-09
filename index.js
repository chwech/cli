#!/usr/bin/env node
const program = require('commander')
const download = require('./download')
const path = require('path')
const caniuse = require('./caniuse')
const tpl = require('./tpl')

const TPL_NAME = {
  'api-cloud': 'api-cloud-template'
}

program
  .command('init <tpl> [target]')
  .description('初始化项目')
  .action((tpl, target) => {
    console.log(tpl, target)
    if (target) {
      let workspace = process.cwd()
      let dirname = path.basename(workspace)
      if (target === dirname) {
        target = '.'
      }
    } else {
      target = '.'
    }
    download(TPL_NAME[tpl], target)
      .then(target => {
        console.log(target)
      })
      .catch(err => {
        console.log(err)
      })
  });

program
  .command('caniuse <feature>')
  .description('caniuse查找特性支持情况')
  .action((feature) => {
    caniuse(feature)
  });

program
  .command('tpl')
  .description('列出现有模板列表')
  .action(() => {
    tpl.ls()
  });

program.parse(process.argv);