# netrunner-entities-demo

*`netrunner-entities` 的演示性质小型项目*

## 简介

`netrunner-entities-demo` 是一个用于简单演示 [netrunner-entities](https://github.com/eric03742/netrunner-entities) 使用方法的项目。

本项目演示将当前（2025.04，《仰望》扩展包发布后）标准环境的全部卡牌以表格形式导出。

本项目运行需要 [netrunner-database](https://github.com/eric03742/netrunner-database) 生成的中文卡牌数据库数据。

## 安装说明

下载源代码后运行如下命令：

```shell
npm install
npm run build:release
```

## 运行说明

```shell
npm run start -- \
    --host={HOST} \
    --port={PORT} \
    --username={USERNAME} \
    --password={PASSWORD} \
    --database={DATABASE} \
    --output={OUTPUT_FILE}
```

**参数说明**

* `--host`：数据库地址
* `--port`：端口
* `--username`：用户名
* `--password`：密码
* `--database`：数据库名
* `--output`：导出文件路径

## 数据源

卡图文件均来自 [NetrunnerDB](https://netrunnerdb.com/) 的公开数据，本仓库只作收集、整理之用，对这些卡图均无版权。

本仓库及其开发者与 Fantasy Flight Games、Wizards of the Coast、Null Signal Games、NetrunnerDB 均无关联。

## 许可证

[MIT](./LICENSE)

## 作者

[Eric03742](https://github.com/eric03742)
