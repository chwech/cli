const fs = require('fs')
const https = require('https')
const { CANIUSE_DATA_VERSION } = require('./data/config')

let log = console.log

function fetchCaniusePackageJson () {
  return new Promise((resolve, reject) => {
    const req = https.get('https://raw.githubusercontent.com/Fyrd/caniuse/master/package.json', (res) => {
      let rawData = ''
      res.on('data', (d) => {
        rawData += d
      });
      // 获取数据完成
      res.on('end', () => {
        resolve(rawData)
      })
    })
    req.on('error', (e) => {
      console.error('获取caniuse数据的package.json出错', e);
      reject(e)
    });
    req.end()
  })
}

async function checkVersion () {
  let packageJson = await fetchCaniusePackageJson()
  packageJson = JSON.parse(packageJson)
  return packageJson.version
}

function search(feature) {
  return new Promise((resolve, reject) => { 
    fs.readFile('./data.json', 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }

      var data1 = JSON.parse(data)
      let result = []

      for(let [key, value] of Object.entries(data1.data)) {
        const keywords = value.keywords
        
        if (keywords.indexOf(feature) !== -1) {
          result.push(value)
        }
      }

      resolve(result)
    })
  })
}

async function caniuse (feature) {
  try {
    // 检查caniuse数据库是否过期
    let version = await checkVersion()
    if (version !== CANIUSE_DATA_VERSION) {
      log(`
      caniuse数据库版本有更新, 
      当前版本号${CANIUSE_DATA_VERSION},
      最新版本号${version}
      `)
    }
    const result = await search(feature)

    result.forEach(item => {
      log('==================================================')
      log('特性:', item.title)
      log('浏览器支持情况:')

      let findOneSupport = false
      let isCheckVersion = []

      for (const [browser, versions] of Object.entries(item.stats)) {
        for(const [version, isSupport] of Object.entries(versions)) {
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
caniuse()
module.exports = caniuse