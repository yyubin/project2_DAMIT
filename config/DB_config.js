const mysql = require("mysql");
//nodejs와 mysql을 연결하기 위한 기능

const conn = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "1234",
    port : "3306",
    database : "damIt"
});

module.exports = conn;