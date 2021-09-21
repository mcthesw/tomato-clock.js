function getXmlhttp() {
    let xmlhttp;
    xmlhttp = new XMLHttpRequest();
    return xmlhttp
}


function getTops() {
    console.log("getTops()")
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET", "/database/tops")
    xmlhttp.send()
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
}

function stopClock(){
    console.log("stopClock()")

    let button = document.getElementById("wrappedButton")
    button.onclick=startClock
    button.innerHTML="Start"
}

function startClock() {
    console.log("startClock()")
    let inputWork = document.getElementById("inputWork").value
    let inputRest = document.getElementById("inputRest").value
    let inputTimes = document.getElementById("inputTimes").value
    let regPos = /(^[1-9]\d*$)/
    let valueList = [inputWork,inputRest,inputTimes]
    for(i in valueList){
        if(!regPos.test(valueList[i])){
            alert("输入数字有误，请不要输入正整数以外的数字")
        }
    }


    let button = document.getElementById("wrappedButton")
    button.onclick=stopClock
    button.innerHTML="Stop"
    console.log("startClock(): 工作 %s 分钟, 休息 %s 分钟, 循环 %s 次", inputWork, inputRest, inputTimes)
}


function regAccount() {
    console.log("regAccount()")
    accountName = document.getElementById("accountName").value
    accountPsw = document.getElementById("accountPsw").value
    // need Encryption 需要加密
    let xmlhttp = getXmlhttp()
    xmlhttp.open("GET","/reg/"+accountName+"/"+accountPsw)
    xmlhttp.send()
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
            switch(xmlhttp.responseText){
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

}

function getStatistics() {
    console.log("getStatistics()")
}

function delAccount() {
    console.log("delAccount()")
}

window.onload = function () {
    console.log("加载完成")
    getTops()
}