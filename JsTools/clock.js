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
    return [accountName, accountPsw]
}


function get_input_times() {
    console.log("startClock()")
    let inputWork = document.getElementById("inputWork").value
    let inputRest = document.getElementById("inputRest").value
    let inputTimes = document.getElementById("inputTimes").value
    let regPos = /(^[1-9]\d*$)/
    let valueList = [inputWork, inputRest, inputTimes]
    for (i in valueList) {
        if (!regPos.test(valueList[i])) {
            alert("输入数字有误，请不要输入正整数以外的数字")
            return "err"
        }
    }
    return {
        Work: inputWork,
        Rest: inputRest,
        Times: inputTimes
    }
}

function minute2seconds(minutes) {
    let seconds = minutes * 60
    return seconds
}

function seconds2minute_and_seconds(seconds) {
    minutes = (seconds / 60) - ((seconds / 60) % 1)
    seconds = seconds % 60
    return {
        minutes: minutes,
        seconds: seconds
    }
}

function print_time(minutes, seconds) {
    minutes = minutes.toString()
    if (minutes.length < 2) {
        minutes = "0" + minutes
    }
    document.getElementById("clock-1").innerHTML = minutes[0]
    document.getElementById("clock-2").innerHTML = minutes[1]

    seconds = seconds.toString()
    if (seconds.length < 2) {
        seconds = "0" + seconds
    }
    document.getElementById("clock-3").innerHTML = seconds[0]
    document.getElementById("clock-4").innerHTML = seconds[1]
}

function sendSuccessWork(work){
    console.log("正在向服务器汇报工作时间")
    accountName= get_name_psw()[0]
    accountPsw=get_name_psw()[1]
    let xmlhttp= getXmlhttp()
    xmlhttp.open("GET", "/add/"+ accountName + "/" + accountPsw+"/"+work)
    xmlhttp.send()
}

function sendFailureWork(){
    console.log("正在向服务器汇报失败次数")
    accountName= get_name_psw()[0]
    accountPsw=get_name_psw()[1]
    let xmlhttp= getXmlhttp()
    xmlhttp.open("GET", "/fail/"+ accountName + "/" + accountPsw)
    xmlhttp.send()
}

function userStopClock() {
    startNormalState()
    clearInterval(window.timer)
    startNormalState()
    print_time(0,0)
    sendFailureWork()
    alert("你放弃了这次番茄钟")
    console.log("番茄钟结束")
}

function startWorkState() {
    document.getElementById("title").innerHTML = "Working"
    let button = document.getElementById("wrappedButton")
    button.onclick = userStopClock
    button.innerHTML = "Stop"
}

function startRestState() {
    document.getElementById("title").innerHTML = "Resting"
    let button = document.getElementById("wrappedButton")
    button.onclick = userStopClock
    button.innerHTML = "Stop"
}

function startNormalState() {
    let button = document.getElementById("wrappedButton")
    document.getElementById("title").innerHTML = "Tomato.JS"
    button.innerHTML = "Start"
    button.onclick = startClock
}

var timer = null

function secondTimer(work, rest, times) {
    workSeconds = minute2seconds(work)
    restSeconds = minute2seconds(rest)
    eachTotalSeconds = workSeconds + restSeconds
    console.log("每次需要运行" + eachTotalSeconds + "秒")
    totalSeconds = eachTotalSeconds * times
    console.log("一共需要运行" + totalSeconds + "秒")
    timer = window.setInterval(
        function () {
            curSeconds = totalSeconds % eachTotalSeconds
            if (totalSeconds < 0) {
                clearInterval(window.timer)
                startNormalState()
                console.log("番茄钟结束")
                alert("番茄钟结束")
            }
            if (curSeconds == 0 && totalSeconds > 0) {
                console.log("开启新一轮")
                curSeconds = eachTotalSeconds
                alert("开始工作")
                startWorkState()
            }
            if (curSeconds > restSeconds) {
                minutes_seconds = seconds2minute_and_seconds(curSeconds - restSeconds)
                print_time(minutes_seconds.minutes, minutes_seconds.seconds)
            }
            if (curSeconds == restSeconds) {
                sendSuccessWork(work)
                console.log("进入休息")
                alert("休息时间")
                startRestState()
            }
            if (curSeconds < restSeconds) {
                minutes_seconds = seconds2minute_and_seconds(curSeconds)
                print_time(minutes_seconds.minutes, minutes_seconds.seconds)
            }
            totalSeconds--
        }, 1000)
}

function startClock() {
    InputTimer = get_input_times()
    if (InputTimer == "err") {
        return
    }
    startWorkState()
    secondTimer(InputTimer.Work, InputTimer.Rest, InputTimer.Times)
    console.log("startClock(): 工作 %s 分钟, 休息 %s 分钟, 循环 %s 次", InputTimer.Work, InputTimer.Rest, InputTimer.Times)
}

function regAccount() {
    console.log("regAccount()")
    accountName = get_name_psw()[0]
    accountPsw = get_name_psw()[1]
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
    accountName = get_name_psw()[0]
    accountPsw = get_name_psw()[1]
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/getSta/" + accountName + "/" + accountPsw)
    xmlhttp.onreadystatechange = function () {
        res = xmlhttp.responseText
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (res != "fail") {
                res = JSON.parse(res)
                let wins = document.getElementById("wins")
                let fails = document.getElementById("fails")
                let time = document.getElementById("time")
                wins.innerHTML = "成功次数:" + res.WINS
                fails.innerHTML = "失败次数:" + res.FAILS
                time.innerHTML = "完成时间:" + res.TIME
            } else {
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
    accountName = get_name_psw()[0]
    accountPsw = get_name_psw()[1]
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