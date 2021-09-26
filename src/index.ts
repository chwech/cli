#!/usr/bin/env node
import path from 'path'
import download from './download'
import { caniuse, updateCaniuseVersion, fetchCaniuseDataJson } from './caniuse'
import { ls, add, clearAll } from './tpl'
import { Command } from 'commander'
const program = new Command();
import os from 'os'
import 
 { schema, defaultOptions, loadOptions, saveOptions } from './options'
import inquirer from 'inquirer'
import shell from 'shelljs'

 try {
   
   const value = schema.validateAsync(defaultOptions)
   console.log(value)
 } catch (error) {
   console.log(error)
 }

console.log(os.homedir())
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

const docpub = (docPath: string, pubPath: string) => {
  shell.cd(path.resolve(pubPath, '..'))
  shell.exec('git checkout master')
  shell.exec('git pull')
  shell.cp('-Ruf', path.resolve(docPath) + '/*', path.resolve(pubPath));
  shell.exec('git add .')
  shell.exec('git commit -m "chore(release): 部署文档"')          
  shell.exec('git push')
}

program
  .command('docpub <name>')
  .description('部署文档')
  .action((name) => {
    const options = loadOptions()
    const pathPair = options?.docsDirMap?.[name]

    if (!pathPair) {
      inquirer
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
          saveOptions({
            docsDirMap: {
              ...loadOptions().docsDirMap,
              [name]: [path.resolve(answers.docPath), path.resolve(answers.pubPath)] 
            }
          })

          docpub(answers.docPath, answers.pubPath)
        })
        .catch((error) => {
          if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
          } else {
            // Something else went wrong
          }
        });
    } else {
      docpub(pathPair[0], pathPair[1])
    }
  })

program.parse(process.argv);

// 列出模板
if (program.ls) {
  ls();
}

if (program.empty) {
  clearAll();
}