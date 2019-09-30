const fs = require('fs')
let log = console.log

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

module.exports = caniuse