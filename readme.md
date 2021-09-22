# Tomato-Clock.JS
番茄钟.JS是一个使用NodeJS作为后端的网页番茄钟软件。本软件开发之初就考虑到跨平台、自定义的问题，因此使用了前后端分离的设计理念，具体介绍见下

## 说明
这是一个开放源代码的番茄钟

## 部署方法
首先将所有文件下载到你的服务器或者电脑，然后安装最新版的Nods.JS和NPM（一般会附带安装好），在当前文件夹打开命令行，执行`npm install`下载依赖，最后运行`npm start`即可，服务器默认开在localhost:8000，如果需要更改请到server.js的文件底端
```
var server = app.listen(8000,function(){
    var host = server.address().address
    var port = server.address().port

    console.log("番茄钟正运行在 http://%s:%s",host,port)
})
```
将8000修改成你想要开放的端口

## 文件说明
- Data.db SQLITE的数据库文件
- sqlite.sql SQLITE的数据库文件
- package.json 依赖库
- server.js 程序入口,内部编写了路由等前后端交互部分
- db.js SQLITE数据库和程序交互所用到的自定义包
- JsTools/ 包含了网页所需的各种JS代码
- index.html 主网页,可以脱离服务端运行(但是必须有其他资源文件)
- res/ 包括了所有的资源文件
- res/font/ 包含了所用的字体，其中iPix.ttf是完整的字体文件，如果需要部署建议使用压缩的字体
- .vscode/ 包含了vscode的调试和自定义词语，需要安装chrome插件
