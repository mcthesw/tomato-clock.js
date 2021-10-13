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

export function getTops() {
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

export function sendSuccessWork(work) {
    console.log("正在向服务器汇报工作时间")
    let xmlhttp = sendData("addTime", work)
    xmlhttp.send()
}

export function sendFailureWork() {
    console.log("正在向服务器汇报失败次数")
    let xmlhttp = sendData("addFails", 1)
    xmlhttp.send()
}

/**
 *Register an account.
 *Name & Psw are from the HTML input.
 * @return {string} error message
 */
export function regAccount() {
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
export function getStatistics() {
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
export function delAccount() {
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