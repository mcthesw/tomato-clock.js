var db = require("./db")
var fs = require("fs")
var path = require("path")
var express = require("express")
var app = express()

//index
app.get("/",function(req,res){
    indexPath = path.resolve("index.html")
    res.status(200).sendFile(indexPath)
    //log here
})

// get the js files
app.get("/JsTools/*",function(req,res){
    jsName = req.url.slice(1)
    jsPath = path.resolve(jsName)
    res.status(200).sendFile(jsPath)
})

// get res
app.get("/res/*",function(req,res){
    fileName = req.url.slice(1)
    filePath = path.resolve(fileName)
    res.status(200).sendFile(filePath)
})

// get css
app.get("/mystyle.css",function(req,res){
    cssPath = path.resolve("mystyle.css")
    res.status(200).sendFile(cssPath)
})

app.get("/database/tops",async function(req,res){
    tops = await db.get_tops()
    res.status(200).send(tops)
})

app.get("/reg/*",async function(req,res){
    cur_url = req.url.slice(5)
    cur_name=cur_url.slice(0,cur_url.indexOf("/"))
    cur_pwd=cur_url.slice(cur_url.indexOf("/"))
    ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
    result = await db.reg(cur_name,ip,cur_pwd)
    res.status(200).send(result)
})

app.get("/del/*",async function(req,res){
    cur_url = req.url.slice(5)
    cur_name=cur_url.slice(0,cur_url.indexOf("/"))
    cur_pwd=cur_url.slice(cur_url.indexOf("/"))
    ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
    result = await db.del(cur_name,ip,cur_pwd)
    res.status(200).send(result)
})

var server = app.listen(8000,function(){
    var host = server.address().address
    var port = server.address().port

    console.log("番茄钟正运行在 http://%s:%s",host,port)
})