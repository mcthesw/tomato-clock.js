function getXmlhttp() {
    let xmlhttp;
    xmlhttp = new XMLHttpRequest();
    return xmlhttp
}


function getTops() {
    console.log("getTops()")
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/database/tops")
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let tops = document.getElementById("tops")
            tops.innerHTML = ""
            res = JSON.parse(xmlhttp.response)
            for (let i = 0; i < res.length; i++) {
                cur_name = res[i].NAME
                cur_time = res[i].TIME
                tops.innerHTML += "<li>" + cur_name + " 一共工作了 " + cur_time + " 分钟</li>"
            }
        }
    }
    xmlhttp.send()
}

function get_name_psw() {
    accountName = document.getElementById("accountName").value
    accountPsw = document.getElementById("accountPsw").value
    return accountName, accountPsw
}

function stopClock() {
    console.log("stopClock()")

    let button = document.getElementById("wrappedButton")
    button.onclick = startClock
    button.innerHTML = "Start"
}

function startClock() {
    console.log("startClock()")
    let inputWork = document.getElementById("inputWork").value
    let inputRest = document.getElementById("inputRest").value
    let inputTimes = document.getElementById("inputTimes").value
    let regPos = /(^[1-9]\d*$)/
    let valueList = [inputWork, inputRest, inputTimes]
    for (i in valueList) {
        if (!regPos.test(valueList[i])) {
            alert("输入数字有误，请不要输入正整数以外的数字")
        }
    }


    let button = document.getElementById("wrappedButton")
    button.onclick = stopClock
    button.innerHTML = "Stop"
    console.log("startClock(): 工作 %s 分钟, 休息 %s 分钟, 循环 %s 次", inputWork, inputRest, inputTimes)
}


function regAccount() {
    console.log("regAccount()")
    accountName, accountPsw = get_name_psw()
    // need Encryption 需要加密
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/reg/" + accountName + "/" + accountPsw)
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            switch (xmlhttp.responseText) {
                case "success":
                    alert("注册成功\n需要使用的话只需要输入账号密码，不需要登陆")
                    break
                case "used name":
                    alert("昵称被占用")
                    break
                default:
                    alert("未知错误")
            }
        }
    }
    xmlhttp.send()

}

function getStatistics() {
    console.log("getStatistics()")
    accountName, accountPsw = get_name_psw()
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/getSta/" + accountName + "/" + accountPsw)
    xmlhttp.onreadystatechange = function () {
        res = xmlhttp.responseText
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if(res!="fail"){
                res = JSON.parse(res)
                let wins = document.getElementById("wins")
                let fails = document.getElementById("fails")
                let time = document.getElementById("time")
                wins.innerHTML = "成功次数:" + res.WINS
                fails.innerHTML = "失败次数:" + res.FAILS
                time.innerHTML = "完成时间:" + res.TIME
            }else{
                alert("出现错误，请检查密码和账号是否正确\n也可能是服务器问题")
            }
        }
    }
    xmlhttp.send()
}

function delAccount() {
    if (!window.confirm("注意，如果选择确定将会删除您的账号")) {
        console.log("取消删除账号")
        return
    }
    console.log("delAccount()")
    accountName, accountPsw = get_name_psw()
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/del/" + accountName + "/" + accountPsw)
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText == "success") {
                alert("删除账号成功")
            } else {
                alert("删除账号失败，请检查账号密码是否正确\n也可能是服务器错误")
            }
        }
    }
    xmlhttp.send()
}

window.onload = function () {
    console.log("加载完成")
    getTops()
}