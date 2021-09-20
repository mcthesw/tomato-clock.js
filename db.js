var sqlite3 = require("sqlite3").verbose()

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


async function reg(name, pwd) {
    // register a user by name and password
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
                    // handle err
                    if (err) {
                        throw err
                    } else {
                        console.log("%s注册成功", name)
                    }
                });
    } else {
        // handle err
        console.log("%s已经被注册", name)
    }
    db.close()
}

async function del(name, pwd) {
    // delete a user by name and password
    let db = get_DB()

    db.close()
}

async function add(name, value, amount) {
    // add a user's time,wins or fails
    let db = get_DB()

    db.close()
}

async function log(name, ip, operation, flag) {
    // logs
    let db = get_DB()

    db.close()
}


module.exports = {
    reg: reg,
    add: add,
    del: del
}