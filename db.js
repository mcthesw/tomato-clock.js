var sqlite3 = require("sqlite3").verbose()
var moment = require("moment")

/**
 * 参考DB教程 https://blog.csdn.net/qq_38081746/article/details/90673681
 * 参考时间教程 https://blog.csdn.net/shenmohui/article/details/110174272
 */


/**
 * Get the Database
 * @returns Database
 */
function get_DB() {
    let db = new sqlite3.Database("Data.db", function (err) {
        if (err) throw err;
    });
    return db
}

async function get_by_name(name) {
    return new Promise(function (resolve, reject) {
        let db = get_DB()
        let sql = "SELECT * FROM UserData WHERE NAME = $name"
        db.get(sql, {
                $name: name
            },
            function (err, row) {
                if (row != undefined) {
                    // undefined may should be null ?
                    // user does exist
                    resolve(row)
                } else {
                    // user not exist
                    resolve(null)
                }
            });
        db.close()
    })
}

/**
 * Register a user by name and password
 * @param {String} name 
 * @param {String} ip 
 * @param {String} pwd 
 */
async function reg(name, ip, pwd) {
    let db = get_DB()
    let sql = "SELECT * FROM UserData WHERE NAME = $name"
    user_data = await get_by_name(name)
    if (user_data == null) {
        sql = "INSERT INTO UserData (NAME,PWD) values ($name,$pwd)",
            db.run(sql, {
                    $name: name,
                    $pwd: pwd
                },
                function (result, err) {
                    if (err) {
                        // sql err
                        log(name, ip, "reg", 0)
                        throw err
                    } else {
                        log(name, ip, "reg", 1)
                    }
                });
    } else {
        // handle err
        log(name, ip, operation = "reg", 0)
        console.log("%s has been registered", name)
        db.close()
        return "used name"
    }
    db.close()
    return "success"
}

/**
 * Delete a user by name and password
 * @param {String} name 
 * @param {String} ip 
 * @param {String} pwd 
 */
async function del(name, ip, pwd) {
    let db = get_DB()
    user = await get_by_name(name)
    if (user != undefined && user.PWD == pwd) {
        sql = "DELETE FROM UserData WHERE NAME = $name"
        db.run(sql, {
            $name: name
        }, function (err) {
            if (err) {
                log(name, ip, "del", 0)
                throw err
            }
        })
        log(name, ip, "del", 1)
        db.close()
        return "success"
    } else {
        log(name, ip, "del", 0)
    }
    db.close()
    return "failed"
}

/**
 * Add a user's time,wins or fails
 * @param {String} name 
 * @param {String} ip 
 * @param {String} pwd 
 * @param {String} value time wins fails
 * @param {Number} amount 
 */
async function add(name, ip, pwd, value, amount) {
    let db = get_DB()
    user = await get_by_name(name)
    if (user != undefined && user.PWD == pwd) {
        switch (value) {
            case "time":
                sql = "UPDATE UserData SET TIME = $amount WHERE NAME = $name"
                amount += user.TIME
                break
            case "wins":
                sql = "UPDATE UserData SET WINS = $amount WHERE NAME = $name"
                amount += user.WINS
                break
            case "fails":
                sql = "UPDATE UserData SET FAILS = $amount WHERE NAME = $name"
                amount += user.FAILS
                break
        }
        db.run(sql, {
            $amount: amount,
            $name: name
        }, function (err) {
            if (err) {
                log(name, ip, "add", 0)
                throw err
            }
        })
        console.log("recorded :%s(%s) add %s to %s ", name, ip, amount, value)
        log(name, ip, "add", 1)
    } else {
        log(name, ip, "add", 0)
    }
    db.close()
}

/**
 * Record log into the database
 * @param {String} name 
 * @param {String} ip 
 * @param {String} operation 
 * @param {Boolean} flag 0 or 1
 */
function log(name, ip, operation, flag) {
    let db = get_DB()
    time = moment().format('YYYY-MM-DD HH:mm:ss');
    sql = "INSERT INTO Logs (TIME,NAME,IP,OPERATION,FLAG) VALUES ($time,$name,$ip,$operation,$flag)"
    db.run(sql, {
            $time: time,
            $name: name,
            $ip: ip,
            $operation: operation,
            $flag: flag
        },
        function (err) {
            if (err) {
                console.log(err)
            }
        })
    console.log("recorded :%s(%s) did %s in %s, flag = %s", name, ip, operation, time, flag)
    db.close()
}

/** 
 * Put msg into console and database
 * @param {String} msg
 */
function warning(msg) {
    let db = get_DB()
    time = moment().format('YYYY-MM-DD HH:mm:ss');
    sql = "INSERT INTO Logs (TIME,NAME,IP,OPERATION,MSG) VALUES ($time,\"system\",\"0.0.0.0\",\"warning\",$msg)"
    db.run(sql, {
            $time: time,
            $msg: msg
        },
        function (err) {
            if (err) {
                console.log("System alert warning in %s, content is %s ,but failed", time, msg)
                console.log(err)
            } else {
                console.log("System alert warning in %s, content is %s", time, msg)
            }
        })
    db.close()
}

/**
 * Get top 10(ordered by time)
 * @returns Array include objects,like [ { NAME: 'Van', TIME: 0 } ]
 */
async function get_tops(){
    function get_tops_from_db(){
        return new Promise(function (resolve,reject){
            let db = get_DB()
            let sql = "SELECT NAME,TIME FROM UserData ORDER BY TIME LIMIT 10"
            db.all(sql,function(err,row){
                if (row != undefined){
                    resolve(row)
                }else{
                    resolve(null)
                }
            })
            db.close()
        })
    }
    tops = await get_tops_from_db()
    return tops
}

module.exports = {
    reg: reg,
    add: add,
    del: del,
    get_tops:get_tops,
    warning: warning
}