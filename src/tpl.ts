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
  const data: any = require('./data/tpl.json')
  const templateList: [tpl] = data.template

  templateList.forEach((tpl: tpl) => {
    console.log(`模板：${tpl.name}   地址：${tpl.git}`)
  })
}