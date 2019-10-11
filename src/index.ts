#!/usr/bin/env node
import program from 'commander'
const download = require('./download')
const path = require('path')
const { caniuse, updateCaniuseVersion, fetchCaniuseDataJson } = require('./caniuse')

const tpl = require('./tpl')

const TPL_NAME = {
  'api-cloud': 'api-cloud-template'
}

program
  .command('init <tpl> [target]')
  .description('初始化项目')
  .action((tpl: string | number, target: string) => {
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
      .then((target: any) => {
        console.log(target)
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
  .command('tpl')
  .description('列出现有模板列表')
  .action(() => {
    tpl.ls()
  });

program.parse(process.argv);