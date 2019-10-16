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