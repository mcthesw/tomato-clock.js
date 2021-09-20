var sqlite3 = require("sqlite3").verbose()

function get_DB(){
    let db = new sqlite3.Database("Data.db",function(err){
        if (err) throw err;
    });
    return db
}

function reg(name,pwd){
    // register a user by name and password
    let db = get_DB()
    let sql = "SELECT * FROM UserData WHERE NAME = $name"
    db.get(sql,{$name:name},
        function(err,row){
            if (row != null) {
                db.close()
                throw NameExist
            }else{
                sql = "INSERT INTO UserData (NAME,PWD) values ($name,$pwd)",
                db.run(sql,{$name:name,$pwd:pwd},
                    function(result,err){
                        // handle err
                        if (err){throw err}else{console.log("%s注册成功",name)}
                    })
            }
    });
    db.close()
}

function del(name,pwd){
    // delete a user by name and password
    let db = get_DB()

    db.close()
}

function add(name,value,amount){
    // add a user's time,wins or fails
    let db = get_DB()

    db.close()
}

function log(name,ip,operation,flag){
    // logs
    let db = get_DB()

    db.close()
}

module.exports = {reg:reg,add:add,del:del}