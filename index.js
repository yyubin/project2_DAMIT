// index.js

const express   = require('express');
const app       = express();
const fs        = require('fs'); // 1
const path = require('path');
const session = require('express-session');                      
const MySQLStore = require('express-mysql-session')(session);   
const static = require('serve-static');

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit:50000000}))
const body = require("body-parser");
app.use(body.json({limit:'1mb'}))
app.use(body.urlencoded({limit:'1mb',extended:false}));

app.set('view engine', 'ejs');
app.engine("html", require("ejs").renderFile);

// Routes
app.use(session({                                              
  secret:"asdfasffdas",
  resave:false,
  saveUninitialized:true,
  store: sessionStore                                          
  }))


app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('views'));
app.use(express.static('blog_imgs'));

app.use(body.json());//json타입
app.use(body.urlencoded({extended:true}));//post방식의 encoding
app.use('/node_modules', express.static(path.join(__dirname+'/node_modules')));
// app.use('controller')
app.use('/static', express.static('views'));
app.use('/static2', express.static('uploadedFiles'));
app.use('/', require('./routes/router'));



const mysql = require('mysql');
const conn = {
  host : "localhost",
  port: "3306",
  user: "root",
  password: "1234",
  database: "damIt"

}

var sessionStore = new MySQLStore(conn);                    



// Port setting
var port = 3700;
app.listen(port, function(){
  var dir = './uploadedFiles';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir); // 2
 
  console.log('server on! http://localhost:'+port);
});