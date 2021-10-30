
const express = require("express");
const app = express();
const router = require("./routes/router.js");
//routes\router.js

const body = require("body-parser")
app.use(body.urlencoded({extended:false}));
//post방식으로 데이터 처리할 때 사용하는 기능

const session = require("express-session");//세션기능 사용
// const mysql_session = require("express-mysql-session");
//세션저장공간설정(mysql)

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());//json타입
app.use(bodyParser.urlencoded({extended:true}));//post방식의 encoding

// let conn = {
//     host : "222.102.104.70",
//     user : "smhrd",
//     password : "1234",
//     port : "3306",
//     database : "nodejs_db"
// }

// let sessionSave = new mysql_session(conn);
// //세션저장공간설정 기능을 사용

// app.use(session({
//     secret : "smart_session",//세션ID설정
//     resave : false,//세션을 항상 저장할건지
//     saveUninitialized : true, //세션을 저장할때 마다 초기화 할건지
//     store : sessionSave
// }));

app.set("view engine", "ejs");
//express에서 갖고있는 view engine 중에 ejs라는 기능을 사용

app.use(router);
app.listen(5501);
