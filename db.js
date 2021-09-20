var sqlite3 = require("sqlite3").verbose()
var moment = require("moment")

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

get_by_name = async function (name) {
    return new Promise(function (resolve, reject) {
        let db = get_DB()
        let sql = "SELECT * FROM UserData WHERE NAME = $name"
        db.get(sql, {
                $name: name
            },
            function (err, row) {
                if (row != null) {
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
 * @param {Number} pwd 
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
                        log(name,ip,operation="reg",0)
                        throw err
                    } else {
                        log(name,ip,operation="reg",1)
                    }
                });
    } else {
        // handle err
        log(name,ip,operation="reg",0)
        console.log("%s has been registered", name)
    }
    db.close()
}

async function del(name, ip, pwd) {
    // delete a user by name and password
    let db = get_DB()

    db.close()
}

async function add(name, ip, value, amount) {
    // add a user's time,wins or fails
    let db = get_DB()

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
    console.log("recoded :%s(%s) did %s in %s, flag = %s", name, ip, operation, time, flag)
    db.close()
}

/** 
 * Put msg into console and database
 * @param {String} msg
*/
function warning(msg){
    let db = get_DB()
    time = moment().format('YYYY-MM-DD HH:mm:ss');
    sql = "INSERT INTO Logs (TIME,NAME,IP,OPERATION,MSG) VALUES ($time,\"system\",\"0.0.0.0\",\"warning\",$msg)"
    db.run(sql,{$time:time,$msg:msg},
        function(err){
            if (err){
                console.log("System alert warning in %s, content is %s ,but failed",time,msg)
                console.log(err)
            }else{
                console.log("System alert warning in %s, content is %s",time,msg)
            }
        })
    db.close()
}

module.exports = {
    reg: reg,
    add: add,
    del: del,
    warning:warning
}