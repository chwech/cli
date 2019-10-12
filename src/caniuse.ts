const fs = require('fs')
const https = require('https')
const { CANIUSE_DATA_VERSION } = require('./data/config')
const chalk = require('chalk');
const ProgressBar = require('progress');
const path = require('path')

let log = console.log

interface configJson {
  CANIUSE_DATA_VERSION: string
}

export async function updateCaniuseVersion() {
  fs.readFile(path.join(__dirname, './data/config.json'), async (err: Error, data: string | configJson) => {
    if (err) {
      console.log(err)
    }
    data = JSON.parse(data as string) as configJson
    data.CANIUSE_DATA_VERSION = await checkVersion()

    fs.writeFile(path.join(__dirname, './data/config.json'), JSON.stringify(data), (err: Error) => {
      if (err) throw err;
      console.log('当前使用caniuse数据库版本为：', (data as configJson).CANIUSE_DATA_VERSION);
    })
  })
}

export function fetchCaniuseDataJson() {
  return new Promise((resolve, reject) => {
    const req = https.get('https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json', (res: any) => {
      var len = parseInt(res.headers['content-length'], 10);  
      let rawData = ''
      var bar = new ProgressBar('downloading [:bar] :rate/bps :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: len
      });
      res.on('data', (d: any) => {
        bar.tick(d.length)
        rawData += d
      });
      // 获取数据完成
      res.on('end', () => {
        fs.writeFile('data.json', rawData, (err: Error) => {
          if (err) throw err;
          console.log('caniuse数据库已更新');
        });
        resolve(rawData)
      })
    })
    req.on('error', (e: any) => {
      console.error('获取caniuse数据的data.json出错', e);
      reject(e)
    });
    req.end()
  })
}

function fetchCaniusePackageJson (): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get('https://raw.githubusercontent.com/Fyrd/caniuse/master/package.json', (res: any) => {
      let rawData = ''
      res.on('data', (d: any) => {
        rawData += d
      });
      // 获取数据完成
      res.on('end', () => {
        resolve(rawData)
      })
    })
    req.on('error', (e: any) => {
      console.error('获取caniuse数据的package.json出错', e);
      reject(e)
    });
    req.end()
  })
}

interface packageJson {
  version: string
}
async function checkVersion () {
  let packageJson: string | packageJson = await fetchCaniusePackageJson()
  packageJson = JSON.parse(packageJson) as packageJson
  return packageJson.version
}

interface data {
  [name: string]: any
}
interface dataJson {
  data: data
}
function search(feature: string) {
  return new Promise((resolve, reject) => { 
    fs.readFile(path.join(__dirname, './src/data/data.json'), 'utf8', (err: any, data: string | dataJson) => {
      if (err) {
        reject(err)
      }

      var data1: dataJson = JSON.parse(data as string)
      let result = []

      for(let [, value] of Object.entries(data1.data)) {
        const keywords = value.keywords
        
        if (keywords.indexOf(feature) !== -1) {
          result.push(value)
        }
      }

      resolve(result)
    })
  })
}

export async function caniuse (feature: string) {
  try {
    // 检查caniuse数据库是否过期
    let version = await checkVersion()
    if (version !== CANIUSE_DATA_VERSION) {
      log(`提示：caniuse数据库版本有更新, 当前版本号${chalk.green(CANIUSE_DATA_VERSION)},最新版本号${chalk.green(version)}, 
      你可以运行${chalk.red('chwech caniuse update')}更新数据库`)
    }
    const result:any = await search(feature)

    result.forEach((item: any) => {
      log('==================================================')
      log('特性:', item.title)
      log('浏览器支持情况:')

      let findOneSupport = false
      let isCheckVersion: string[] = []

      for (const [browser, versions] of Object.entries(item.stats)) {
        for(const [version, isSupport] of Object.entries(versions as any)) {
          if (isCheckVersion.includes(version)) {
            findOneSupport = false
            continue
          }
          if (findOneSupport) {
            continue
          }
          if (isSupport === 'y') {
            log(browser + '支持版本' + version + '以上')
            findOneSupport = true
            isCheckVersion.push(version)
          }
        }
      }
      log('==================================================')
    })
  } catch (error) {
    log('查找失败：', error)
  }
}