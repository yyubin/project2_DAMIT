const { response } = require('express');
var express  = require('express');
var router   = express.Router();
var multer   = require('multer'); // 1




var storage  = multer.diskStorage({ // 2
  destination(req, file, cb) {
    cb(null, 'uploadedFiles/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});
var upload = multer({ dest: 'uploadedFsiles/' }); // 3-1
var uploadWithOriginalFilename = multer({ storage: storage }); // 3-2

router.get('/project_%20request.html', function(req,res){
  return res.render('project_request.html');
});

router.post('/uploadFile', upload.single('attachment'), function(req,res){ // 4 
  res.render('confirmation', { file:req.file, files:null });
});

router.post('/uploadFileWithOriginalFilename', uploadWithOriginalFilename.single('attachment'), function(req,res){ // 5
  res.render('confirmation', { file:req.file, files:null });
});

router.post('/uploadFiles', upload.array('attachments'), function(req,res){ // 6
  res.render('confirmation', { file: null, files:req.files} );
});

router.post('/uploadFilesWithOriginalFilename', uploadWithOriginalFilename.array('attachments'), function(req,res){ // 7
  res.render('confirmation', { file:null, files:req.files });
});

router.get('/', function(req, res){
  return res.render('main.html');
});
router.get('/main.html', function(req, res){
  return res.render('main.html');
});
router.get('/register.html', function(req, res){
  return res.render('register.html');
});

router.get('/login.html', function(req, res){
  return res.render('login.html');
});

router.get('/write.html', function(req,res){
  return res.render('write.html');
});
router.post("/a", function(req,res){
  res.redirect("http://localhost:3700/main.html")
});

router.post("/pro_req", function(request, response){

  let req_com = request.body.req_com;
  let req_name = request.body.req_name;
  let req_phone = request.body.req_phone;
  let req_email = request.body.req_email;
  let req_msg = request.body.req_msg;
  let req_depart = request.body.req_depart;
  let data_info = request.body.data_info;
  
  conn.connect();    
  
  let sql2 = "insert into applyinfos values(?, ?, ?, ?, ?, now())";
  
  conn.query(sql2,[user_id,req_com, req_depart, req_msg, data_info], function(err,row){
      if(!err){
          console.log(user_name+"");
        
      }else{
          console.log("");
        
      }

  })

  
  conn.end();
});

router.post("/join", function(request,response){
  let name = request.body.name;
  let email = request.body.email;
  let password = request.body.email;
});
// (
//   `USER_ID`     VARCHAR(100)    NOT NULL    COMMENT '유저아이디', 
//   `USER_EMAIL`  VARCHAR(100)    NULL        COMMENT '유저이메일', 
//   `USER_PHONE`  VARCHAR(20)     NULL        COMMENT '유저연락처', 
//   `USER_PWD`    VARCHAR(100)    NULL        COMMENT '비밀번호', 
//   `USER_NAME`   VARCHAR(100)    NULL        COMMENT '유저이름', 
//   `USER_LEVEL`  INT             NULL        COMMENT '유저레벨', 
//   `ADMIN_YN`    VARCHAR(1)      NULL        COMMENT '관리자여부', 
//   CONSTRAINT PK_USERS PRIMARY KEY (USER_ID)
// );



module.exports = router;