[![Build Status](https://www.travis-ci.org/chwech/cli.svg?branch=master)](https://www.travis-ci.org/chwech/cli) <a href="https://npmcharts.com/compare/@chwech/cli?interval=1"><img alt="npm" src="https://img.shields.io/npm/dt/@chwech/cli"></a>
<a href="https://www.npmjs.com/package/@chwech/cli"><img alt="npm (scoped)" src="https://img.shields.io/npm/v/@chwech/cli"></a>

# 安装
```
npm i -g @chwech/cli
```

# 使用
## 显示当前版本号
``` shell
chwech -v

chwech --version
```

## 模板管理
``` shell
// 列出模板列表
chwech tpl

// 初始化api-cloud-template
chwech init api-cloud
```

## caniuse查询
``` shell
// caniuse查询
chwech caniuse es6

// 更新caniuse数据库
chwech caniuse update
```