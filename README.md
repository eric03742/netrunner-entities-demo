# netrunner-entities-demo

*`netrunner-entities` 的演示性质小型项目*

## 简介

`netrunner-entities-demo` 是一个用于简单演示 [netrunner-entities](https://github.com/eric03742/netrunner-entities) 使用方法的项目。

本项目演示将当前（2025.04，《仰望》扩展包发布后）标准环境的全部卡牌以csv表格形式导出。

本项目运行需要 [netrunner-database](https://github.com/eric03742/netrunner-database) 生成的中文卡牌数据库数据。

## 安装说明

下载源代码后运行如下命令：

```shell
npm install
npm run build:release
```

## 运行说明

```shell
npm run start
```

## 数据源

你可以在项目目录中的 `result` 文件夹下查看最新版本的标准环境卡牌数据。

本项目使用 [netrunner-database](https://github.com/eric03742/netrunner-database) 生成的 SQLite 数据库文件作为数据来源。

卡牌数据来自 [NetrunnerDB](https://netrunnerdb.com/) 及其 GitHub 仓库 [netrunner-card-json](https://github.com/NetrunnerDB/netrunner-cards-json)，中文文本数据来自 [netrunner-card-text-Chinese](https://github.com/eric03742/netrunner-card-text-Chinese)。

本仓库及其开发者与 Fantasy Flight Games、Wizards of the Coast、Null Signal Games、NetrunnerDB 均无关联。

## 许可证

[MIT](./LICENSE)

## 作者

[Eric03742](https://github.com/eric03742)
