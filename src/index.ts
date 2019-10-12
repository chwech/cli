#!/usr/bin/env node
import path from 'path'

import program from 'commander'

import download from './download'
import { caniuse, updateCaniuseVersion, fetchCaniuseDataJson } from './caniuse'

const tpl = require('./tpl')

interface tpl {
  [propName: string]: string;
}
const TPL_NAME: tpl = {
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