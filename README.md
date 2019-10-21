[![Build Status](https://www.travis-ci.org/chwech/cli.svg?branch=master)](https://www.travis-ci.org/chwech/cli)   

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