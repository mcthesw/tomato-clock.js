# Tomato-Clock.JS
番茄钟.JS是一个使用NodeJS作为后端的网页番茄钟软件。本软件开发之初就考虑到跨平台、自定义的问题，因此使用了前后端分离的设计理念，具体介绍见下

## 服务端
### 所需文件
- Data.db SQLITE的数据库文件
- sqlite.sql SQLITE的数据库文件
- package.json 依赖库
- server.js 程序入口,内部编写了路由等前后端交互部分
- db.js SQLITE数据库和程序交互所用到的自定义包

## 客户端
### 所需文件
- JsTools/ 包含了网页所需的各种JS代码
- index.html 主网页,可以脱离服务端运行(但是必须有其他资源文件)