# Tomato-Clock.JS
番茄钟.JS是一个使用NodeJS作为后端的网页番茄钟软件。本软件开发之初就考虑到跨平台、自定义的问题，因此使用了前后端分离的设计理念，具体介绍见下

## 说明
这是一个开放源代码的番茄钟

## 部署方法
首先将所有文件下载到你的服务器或者电脑，然后安装最新版的Nods.JS和NPM（一般会附带安装好），在当前文件夹打开命令行，执行`npm install`下载依赖，然后执行`npm run build`(每次更新版本都需要重新运行该语句)，最后运行`npm start`或者`npm run serve`即可，服务器默认开在localhost:8000，如果需要更改请到src/server.ts的文件顶端
```
// const port
const port = 8000;
```
将8000修改成你想要开放的端口

## 文件说明
- Data.db SQLITE的数据库文件
- sqlite.sql SQLITE的数据库文件
- package.json 依赖库
- src 服务端源代码
  - server.ts 程序入口,内部编写了路由等前后端交互部分
  - db.ts SQLITE数据库和程序交互所用到的自定义包
- static/ 包括了所有的前端需要的静态资源文件
  - static/font/ 包含了所用的字体，其中iPix.ttf是完整的字体文件，如果需要部署建议使用压缩的字体
  - static/JsTools/ 包含了网页所需的各种JS代码
  - static/css/ 网页样式文件
  - static/html/ 网页文件，其中index.html是主网页
