function get_name_psw() {
    // need Encryption 需要加密
    let accountName = document.getElementById("accountName").value
    let accountPsw = document.getElementById("accountPsw").value
    return [accountName, accountPsw]
}

function getXmlhttp() {
    let xmlhttp;
    xmlhttp = new XMLHttpRequest();
    return xmlhttp
}

function sendData(operation, amount) {
    let name = get_name_psw()[0]
    let psw = get_name_psw()[1]
    let xmlhttp = getXmlhttp();
    let url = "app/?operation=" + operation +
        "&name=" + name +
        "&psw=" + psw +
        "&amount=" + amount;
    xmlhttp.open("GET", url);
    console.log(url)
    return xmlhttp
}

function getTops() {
    console.log("getTops()")
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/database/tops")
    xmlhttp.onreadystatechange = function () {
        let cur_time;
        let cur_name;
        let res;
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let tops = document.getElementById("tops")
            tops.innerHTML = ""
            res = JSON.parse(xmlhttp.response)
            for (let i = 0; i < res.length; i++) {
                ({NAME: cur_name, TIME: cur_time} = res[i]);
                tops.innerHTML += "<li>" + cur_name + " 一共工作了 " + cur_time + " 分钟</li>"
            }
        }
    }
    xmlhttp.send()
}

function sendSuccessWork(work) {
    console.log("正在向服务器汇报工作时间")
    let xmlhttp = sendData("addTime", work)
    xmlhttp.send()
}

function sendFailureWork() {
    console.log("正在向服务器汇报失败次数")
    let xmlhttp = sendData("addFails", 1)
    xmlhttp.send()
}

/**
 *Register an account.
 *Name & Psw are from the HTML input.
 * @return {string} error message
 */
function regAccount() {
    console.log("regAccount()")
    let accountName = get_name_psw()[0]
    let accountPsw = get_name_psw()[1]
    let regPos = /^[A-Za-z0-9_]{4,10}$/
    if (!regPos.test(accountName) || accountName.length <= 4) {
        alert("请不要输入英文和数字以外的字符，昵称长度请大于4小于10")
        return "err"
    }
    if (accountPsw.length <= 4) {
        alert("密码长度请大于4")
        return "err"
    }
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/reg/" + accountName + "/" + accountPsw)
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
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

/**
 *Get your score
 */
function getStatistics() {
    console.log("getStatistics()")
    let accountName = get_name_psw()[0]
    let accountPsw = get_name_psw()[1]
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/getSta/" + accountName + "/" + accountPsw)
    xmlhttp.onreadystatechange = function () {
        let res = xmlhttp.responseText
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            if (res !== "fail") {
                res = JSON.parse(res)
                let {WINS, TIME, FAILS} = res;
                document.getElementById("wins").innerHTML = "成功次数:" + WINS
                document.getElementById("fails").innerHTML = "失败次数:" + FAILS
                document.getElementById("time").innerHTML = "完成时间:" + TIME
            } else {
                alert("出现错误，请检查密码和账号是否正确\n也可能是服务器问题")
            }
        }
    }
    xmlhttp.send()
}

/**
 *Delete a account.
 */
function delAccount() {
    if (!window.confirm("注意，如果选择确定将会删除您的账号")) {
        console.log("取消删除账号")
        return
    }
    console.log("delAccount()")
    let accountName = get_name_psw()[0]
    let accountPsw = get_name_psw()[1]
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/del/" + accountName + "/" + accountPsw)
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            if (xmlhttp.responseText === "success") {
                alert("删除账号成功")
            } else {
                alert("删除账号失败，请检查账号密码是否正确\n也可能是服务器错误")
            }
        }
    }
    xmlhttp.send()
}



/**
 *Get input MINUTES
 * @return {object} include Work,Rest,Times
 */
function get_input_times() {
    console.log("startClock()")
    let inputWork = document.getElementById("inputWork").value
    let inputRest = document.getElementById("inputRest").value
    let inputTimes = document.getElementById("inputTimes").value
    let regPos = /(^[1-9]\d*$)/
    let valueList = [inputWork, inputRest, inputTimes]
    for (let i in valueList) {
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

function seconds2minute_and_seconds(seconds) {
    let minutes = (seconds / 60) - ((seconds / 60) % 1)
    seconds = seconds % 60
    return {
        minutes: minutes,
        seconds: seconds
    }
}

/**
 *Show the time 
 *
 * @param {number} minutes
 * @param {number} seconds
 */
function print_time(minutes, seconds) {
    let strMinutes = minutes.toString()
    if (strMinutes.length < 2) {
        strMinutes = "0" + strMinutes
    }
    document.getElementById("clock-1").innerHTML = strMinutes[0]
    document.getElementById("clock-2").innerHTML = strMinutes[1]

    let strSeconds = seconds.toString()
    if (strSeconds.length < 2) {
        strSeconds = "0" + strSeconds
    }
    document.getElementById("clock-3").innerHTML = strSeconds[0]
    document.getElementById("clock-4").innerHTML = strSeconds[1]
}

/**
 * @param {String} state work,rest,normal
 */
function startState(state){
    let buttonText;
    let buttonFunc;
    let titleText;
    switch (state) {
        case "work":
            titleText = "Working"
            buttonText = "Stop"
            buttonFunc = userStopClock
            break;
        case "rest":
            titleText = "Resting"
            buttonText = "Stop"
            buttonFunc = userStopClock
            break;
        case "normal":
            titleText = "Tomato.JS"
            buttonText = "Start"
            buttonFunc = startClock
            break;
    }
    document.getElementById("title").innerHTML = titleText
    document.getElementById("wrappedButton").onclick = buttonFunc
    document.getElementById("wrappedButton").innerHTML = buttonText
}


var timer = null;

/**
 *The most important function.
 *It will create an interval to manage the clock
 * @param {number} work
 * @param {number} rest
 * @param {number} times
 */
function secondTimer(work, rest, times) {
    let workSeconds = work * 60
    let restSeconds = rest * 60
    let eachTotalSeconds = workSeconds + restSeconds
    let totalSeconds = eachTotalSeconds * times
    console.log("每次需要运行" + eachTotalSeconds + "秒")
    console.log("一共需要运行" + totalSeconds + "秒")
    timer = window.setInterval(
        function () {
            let curSeconds = totalSeconds % eachTotalSeconds // rest of time
            if (totalSeconds <= 0) {
                clearInterval(window.timer)
                changeToState("normal","番茄钟结束")
            }
            if (curSeconds === restSeconds) {
                sendSuccessWork(work)
                changeToState("rest","进入休息")
            }
            if (curSeconds === 0 && totalSeconds > 0) {
                curSeconds = eachTotalSeconds
                changeToState("work","开启新一轮")
            }

            // print the time, work time or rest time
            let minutes_seconds;
            if (curSeconds > restSeconds) {
                minutes_seconds = seconds2minute_and_seconds(curSeconds - restSeconds)
                print_time(minutes_seconds.minutes, minutes_seconds.seconds)
            }
            if (curSeconds < restSeconds) {
                minutes_seconds = seconds2minute_and_seconds(curSeconds)
                print_time(minutes_seconds.minutes, minutes_seconds.seconds)
            }
            totalSeconds--
        }, 10)
}

/**
 *
 * @param {string} state work,rest,normal,fail
 * @param {string} message the massage to alert and log
 * */
function changeToState(state,message){
    startState(state)
    console.log(message)
    alert(message)
}

/**
 *The function that band to the start button.
 *It will call function "secondTimer"
 */
function startClock() {
    let InputTimer = get_input_times()
    if (InputTimer === "err") {
        return
    }
    startState("work")
    secondTimer(InputTimer.Work, InputTimer.Rest, InputTimer.Times)
    console.log("startClock(): 工作 %s 分钟, 休息 %s 分钟, 循环 %s 次", InputTimer.Work, InputTimer.Rest, InputTimer.Times)
}

function userStopClock() {
    clearInterval(window.timer)
    changeToState("normal","放弃了番茄钟")
    print_time(0, 0)
    sendFailureWork()
}

window.onload = function () {
    console.log("加载完成")
    getTops()
}