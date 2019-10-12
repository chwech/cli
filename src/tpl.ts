const data = require('./data/tpl.json')

interface tpl {
  name: string,
  git: string
}
export function ls() {
  data.template.forEach((tpl: tpl) => {
    console.log(`模板：${tpl.name}   地址：${tpl.git}`)
  })
}