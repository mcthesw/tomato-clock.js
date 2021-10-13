import {getTops, sendFailureWork, sendSuccessWork} from "./message";


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
                changeToState("done","番茄钟结束")
            }
            if (curSeconds === restSeconds) {
                changeToState("rest","进入休息",work)
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
        }, 1000)
}

/**
 *
 * @param {string} state work,rest,done,fail
 * @param {string} message the massage to alert and log
 * @param {number} work work time (minute)
 * */
function changeToState(state,message,work=0){
    switch (state){
        case "work":
            startState("work")
            break
        case "rest":
            sendSuccessWork(work)
            startState("rest")
            break
        case "done":
            startState("normal")
            break
        case "fail":
            clearInterval(window.timer)
            startState("normal")
            print_time(0, 0)
            sendFailureWork()
            break
    }
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
    changeToState("fail","放弃了番茄钟")
}

window.onload = function () {
    console.log("加载完成")
    getTops()
}