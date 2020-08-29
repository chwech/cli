import fs from 'fs'
import path from 'path'

interface tpl {
  name: string,
  git: string
}

/**
 * 列出模板列表
 * @date 2019-10-15
 * @export
 */
export function ls(): void {
  const templateList: tpl[] = require('./data/tpl.json')

  templateList.forEach((tpl: tpl) => {
    console.log(`模板：${tpl.name}   地址：${tpl.git}`)
  })
}


/**
 * 添加模板
 * @date 2020-08-29
 * @export
 * @param {string} name
 * @param {string} url
 */
export function add (name: string, url: string): void {
  let templateList: tpl[] = require('./data/tpl.json')
  templateList.push({
    name: name,
    git: url
  })
  try {
    fs.writeFileSync(path.resolve(__dirname, './data/tpl.json'), JSON.stringify(templateList))
    console.log('添加成功', name, url)
  } catch (error) {
    console.log('添加失败', error)
  }
}

export function clearAll (): void {
  try {
    fs.writeFileSync(path.resolve(__dirname, './data/tpl.json'), JSON.stringify([]))
    console.log('清空成功')
  } catch (error) {
    console.log('清空失败', error)
  }
}