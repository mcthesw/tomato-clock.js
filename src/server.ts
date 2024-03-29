// const port
const port = 8000;

import db = require("./db");
import express = require("express");
const app = express();


app.get("/database/tops", async function (req, res) {
    let tops = await db.get_tops()
    res.status(200).send(tops)
})

app.get("/reg/*", async function (req, res) {
    let cur_url = req.url.slice(5)
    let cur_name = cur_url.slice(0, cur_url.indexOf("/"))
    let cur_pwd = cur_url.slice(cur_url.indexOf("/") + 1)
    let ip = req.ip
    let result = await db.reg(cur_name, ip, cur_pwd)
    res.status(200).send(result)
})

app.get("/del/*", async function (req, res) {
    let cur_url = req.url.slice(5)
    let cur_name = cur_url.slice(0, cur_url.indexOf("/"))
    let cur_pwd = cur_url.slice(cur_url.indexOf("/") + 1)
    let ip = req.ip
    let result = await db.del(cur_name, ip, cur_pwd)
    res.status(200).send(result)
})

app.get("/getSta/*", async function (req, res) {
    let cur_url = req.url.slice(8)
    let cur_name = cur_url.slice(0, cur_url.indexOf("/"))
    let cur_pwd = cur_url.slice(cur_url.indexOf("/") + 1)
    let cur_info = await db.get_by_name(cur_name)
    if (cur_info == null) {
        res.status(200).send("fail")
        return
    }
    let result;
    if (cur_info.PWD !== cur_pwd) {
        result = "fail"
    } else {
        result = cur_info
    }
    delete result.PWD
    delete result.ID
    res.status(200).send(result)
})


const parse = require("url").parse
app.get("/app?*", function (req, res) {

    let user = parse(req.url, true).query
    let ip = req.ip
    try {
        switch (user.operation) {
            case "addTime":
                db.add(user.name, ip, user.psw, "time", Number(user.amount))
                db.add(user.name, ip, user.psw, "wins", 1)
                break
            case "addWins":
                db.add(user.name, ip, user.psw, "wins", Number(user.amount))
                break
            case "addFails":
                db.add(user.name, ip, user.psw, "fails", Number(user.amount))
                break
        }
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
})

// static resources
app.use(express.static("static/"));
// webpages
app.use(express.static("static/html/"));

const server = app.listen(port, function () {
    console.log("番茄钟正运行在 http://%s:%s", "localhost", port)
});