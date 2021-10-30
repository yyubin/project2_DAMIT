const { response, json } = require('express');
var express  = require('express');
const app = express();
var router   = express.Router();
var multer   = require('multer'); // 1
const conn = require("../config/DB_config");
var request1 = require('request');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var mkdirp = require('mkdirp');
const path = require('path');
const { log } = require('console');
const { tempdir } = require('shelljs');
const { dump } = require('pm2');
app.use(express.json({limit:'1mb'}))
app.use(express.urlencoded({limit:'1mb',extended:false}));



var storage  = multer.diskStorage({ // 2
  destination(req, file, cb) {
    cb(null, 'views/assets/img/blog_imgs/');
  },
  filename(req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
var storage2  = multer.diskStorage({ // 2
  destination(req, file, cb) {
    cb(null, 'views/assets/img/blog_imgs/');
  },
  filename(req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
var storage3  = multer.diskStorage({ // 2
  destination(req, file, cb) {
    cb(null, 'uploadedFiles/rep/');
  },
  filename(req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});


var upload = multer({ dest: 'uploadedFsiles/' }); // 3-1
var upload2 = multer({ dest: 'uploadedFsiles/', filename:function(req,file,cb){`${file.originalname}`} });

var uploadWithOriginalFilename = multer({ storage: storage }); // 3-2
var uploadWithOriginalFilename2 = multer({ storage2: storage2 });
var upload_rep = multer({storage : storage3});

router.get('/test', function(req,res){
  res.render('index');
});

router.post('/uploadFile', upload.single('attachment'), function(req,res){ // 4 
  res.render('confirmation', { file:req.file, files:null, name:req.file.filename });
});


router.get('/project_%20request.html', function(req,res){
  return res.render('project_request.html');
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
router.get('/mypage.html', function(req, res){
  return res.render('mypage.html');
});

router.get('/service.html', function(req, res){
  return res.render('service.html');
});
router.get('/main.html', function(req, res){
  return res.render('main.html');
});





router.get('/register.html', function(req, res){
  return res.render('register.html');
});
router.get('/blog.html', function(req, res){
  return res.render('blog.html');
});
router.get('/faq.html', function(req, res){
  return res.render('faq.html');
});
router.get('/qa_write.html', function(req, res){
  return res.render('qa_write.html');
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



router.post("/Join", function (request, response) { // 회원가입 라우터
  let id = request.body.id; // 웹에서 보내준 아이디 
  let email = request.body.email; // 웹에서 보내준 이메일 
  let phone = request.body.phone; // 웹에서 보내준 전화번호 값
  let pw = request.body.pw; // 웹에서 보내준 유저 패스워드 
  let name = request.body.name; // 웹에서 보내준 유저 이름 
  let level = request.body.level // 웹에서 보내준 유저 레벨
  let admin = request.body.admin; // 웹에서 보내준 관리자 여부
    

  // 쿼리문 작성을 위한 각 변수에 공백 담기
  let sql = ""; 

  sql = "insert into USERS values (?,?,?,?,?, 7, 'y')"; // 위에서 받아온 회원가입 데이터를 users 테이블에 삽입

  conn.query(sql,[id, email, phone, pw, name, level, admin], function(err,row){
    if(!err){
        console.log(id + "님이 회원가입 하였습니다.");
        response.redirect("http://localhost:3700/main.html");//로그인전 메인페이지 이동
    }else{
        console.log("회원가입에 실패하였습니다.");
        response.redirect("http://localhost:3700/register.html"); // 회원가입 페이지 이동
    }
}) 

});

router.post("/Login", function(request, response){
  let user_id = request.body.id;
  let user_pw = request.body.pw;


  // DB에 사용자의 id 검색
  let sql = "select * from users where user_id = ?";

  conn.query(sql, [user_id], function(err,row){
    console.log(row);
    console.log(row.length);
      if(row.length > 0){
          for(let i = 0 ; i < row.length; i++){
              if(user_pw == row[i].USER_PWD){ //검색된 ID가 있을 때 비교
                  console.log(row[0].USER_ID);

                  request.session.display = {"id":row[0].USER_ID};
                  // xhr.send(JSON.stringify({ id: id.value, password: password.value }));
                
                  request.session.save(function(){
                    response.redirect('/');
                  });
                  console.log("로그인성공");
                  // 로그인 후 메인페이지 이동
              }
              else{
                console.log(row[i].user_id);
                  console.log(row[i].user_pwd);
                  console.log("로그인 실패1");
                  response.redirect("http://localhost:3700/login.html") //로그인 실패시 로그인창 이동
                  
              }
          }
      }else{//검색된 id가 없을때
          console.log("로그인 실패2");
          response.redirect("http://localhost:3700/login.html")// 로그인 실패시 로그인창 이동
      }
  });
  
});




router.post("/pro_req", uploadWithOriginalFilename.single('attachment'), function (request, response) { 
  let req_com = request.body.req_com;
  let req_msg = request.body.req_msg;
  let req_depart = request.body.req_depart;
  let data_info = request.body.data_info;
  let req_id = request.session.display.id;
  let filename = request.file.filename;

  var videoDataJson = { 
    'filename':request.file.filename,
    'filepath': request.file.path
  }
  console.log(videoDataJson['filename']);
  console.log(videoDataJson['filepath']);

  // 쿼리문 작성을 위한 각 변수에 공백 담기
  let sql = "insert into applyinfos(user_id, company, dept_name, requirements, data_type, apply_date,filename) values (?,?,?,?,?,now(),?)";

  conn.query(sql,[req_id,req_com, req_depart, req_msg, data_info,filename], function(err,row){
    if(!err){
         // flask api 호출
         console.log('reguest file: ' + request.file);
         console.log('request file obj 1: ' + request.file.path);
         console.log('request file obj 2: ' + request.file.originalname);

        //  
         const requestCall = (callback)=>{
           const options = {
               method: 'POST',
               uri: "http://121.147.0.247:9000/segVideo",
               qs: {
                  // 'file_json' : videoDataJson
                  'filename':request.file.filename,
                  'filepath': request.file.path
               }
           }
          console.log('실행중');
           request1(options, function (err, res) {
               callback(undefined, {
                   result:res
               });
               
              //  response.render('project_label.html');
           });
         }

       requestCall((err, {result}={})=>{
           if(err){
               console.log("error!!!!");
               response.send({
                   message: "fail",
                   status: "fail"
               });
           }
           console.log('result: '+ result);
          //  let json = JSON.parse(result);

          //  var info = JSON.parse(result)
           
           console.log(JSON.stringify(result));
           let label_result = JSON.stringify(result);
           console.log(JSON.parse(label_result).body);
           let sel_result = JSON.parse(label_result).body;
           console.log(JSON.parse(sel_result).folder_name);
           console.log(JSON.parse(sel_result).original_name[0]);
           console.log(JSON.parse(sel_result).xsize);
           console.log(JSON.parse(sel_result).ysize);
           
           response.render('project_label',{ 
            file:request.file, files:null,
            message: "from flask",
            status: "success",
            
                folder_name : JSON.parse(sel_result).folder_name,
                original_name : JSON.parse(sel_result).original_name,
                xsize : JSON.parse(sel_result).xsize,
                ysize : JSON.parse(sel_result).ysize
            
          })

          //  response.send({
          //      message: "from flask",
          //      status: "success",
          //      data:{
          //          json
          //      }
              
          //  });
           
          //  response.render('project_label.html', { file:request.file, files:null });
       })
        
    

        // response.render('project_label.html', { file:request.file, files:null });
        // response.redirect("http://localhost:3700/project_label.html"); 
    }else{
        console.log(err);
        response.redirect("http://localhost:3700/register.html"); 
    }
}) 

});

router.post("/qa_set", function(request, response) {
  let qa_title =  request.body.qa_title;
  let qa_text = request.body.qa_text;
  let id = request.session.display.id;

  let sql = "insert into bloginfos(subject,content,user_id,reg_date,delete_level,blog_num) values(?,?,?,now(),7,3)"
  conn.query(sql,[qa_title,qa_text,id], function(err,row){
    if(!err){
      console.log("qa등록성공");
      response.redirect("http://localhost:3700/faq.html");
    }else{
      console.log(err);
      response.redirect("http://localhost:3700/qa_write.html");
    }
  })

  

});

router.post("/bloginfoinsert", uploadWithOriginalFilename.single('attachment'),function (request, response) { // 블로그 게시글 삽입하는 라우터 
  
  let subject = request.body.subject; // 블로그 글제목
  let content = request.body.content; // 블로그 글내용
  let req_id = request.session.display.id; // 웹에서 받아온 아이디
  let add_files1 = request.file.originalname; // 첨부파일1
  let kind = request.body.kind; // 웹에서 받아온 블로그 종류 (수행기, 기술동향)

  
  let sql = "";
  
  // 블로그 게시글 삽입

  if(kind == "수행기"){
    sql = "insert into bloginfos(SUBJECT, CONTENT, USER_ID, REG_DATE, ADD_FILES1, DELETE_LEVEL,BLOG_NUM) values (?, ?, ?, now(), ?, 7, 1)";
  }else if(kind =="기술동향"){
    sql =  "insert into bloginfos(SUBJECT, CONTENT, USER_ID, REG_DATE, ADD_FILES1, DELETE_LEVEL,BLOG_NUM) values (?, ?, ?, now(), ?, 7, 2)";
  }

  conn.query(sql,[subject, content, req_id, add_files1], function(err,row){
    if(!err){
        console.log(req_id + "블로그 작성 성공");
        
        response.render("main.html",{ file:request.file, files:null });
    }else{
        console.log("블로그 작성 실패.");
        console.log(err);
        response.redirect("http://localhost:3700/blog_details.html"); // 블로그 작성 페이지 이동
    }
})

});

router.get("/mypage", function (request, response) { // 마이페이지 라우터

  let req_id = request.session.display.id;


  // 쿼리문 작성을 위한 각 변수에 공백 담기
  let sql1 = "select * from users where user_id=?";
  let sql2 = "select * from bloginfos where user_id=? and blog_num=3";
  let sql3 = "select * from applyinfos where user_id=?"
  conn.query(sql1,[req_id], function(err,row){
    if(!err){
    

          conn.query(sql2,[req_id], function(err1,row1){
          if(!err1){
      
          console.log(row1);
          console.log(row1.length);

            conn.query(sql3,[req_id], function(err2,row2){

              response.render('mypage',{
              name:row[0].USER_NAME,
              row1:row1,
              label:row2.length
              })
            })
        
      }else{
        console.log(err1);
      }
    });
      
        console.log(row[0].USER_NAME);
        console.log(row);

    }else{
        console.log(err);
        alert("로그인 정보가 없습니다!");
        response.redirect("main.html");
    }
  })

});

router.get('/project_label.html', function(req,res){
  res.render('project_label.html')
})

router.post("/mypage2", function (request, response) { // 마이페이지 라우터

  let req_id = request.session.display.id;


  // 쿼리문 작성을 위한 각 변수에 공백 담기
  let sql1 = "select * from users where user_id=?";
  let check1= 1;
  let sql3 = "select * from applyinfos where user_id=?"
  conn.query(sql1,[req_id], function(err,row){
    if(!err){
  
      conn.query(sql3,[req_id], function(err2,row2){
        console.log("체크값"+row2.length);
        console.log(row2);
        
          response.render('mypage2',{
            name : row[0].USER_NAME,
            email: row[0].USER_EMAIL,
            phone : row[0].USER_PHONE,
            id : req_id,
            seq : row2[0].APPLY_SEQ,
            company : row2[0].COMPANY,
            dept:row2[0].DEPT_NAME,
            require : row2[0].REQUIREMENTS,
            row2 : row2

        })
        
        })


      }
    })

});

router.post("/mypage2_label", function (request, response) { 

  let req_id = request.session.display.id;
  let seq = request.body.seq;
  console.log(seq);
  
  // 쿼리문 작성을 위한 각 변수에 공백 담기
  let sql = "select * from applyinfos where user_id =? and apply_seq =?";

  conn.query(sql,[req_id,seq], function(err,row){
    if(!err){
        
        response.send({
          sel_seq : seq,
          sel_id :req_id,
          sel_company : row[0].COMPANY,
          sel_dept : row[0].DEPT_NAME,
          sel_req : row[0].REQUIREMENTS,
          sel_data : row[0].DATA_TYPE,
          sel_date : row[0].APPLY_DATE
        });
        
    }else{
        console.log(err);
    
    }
}) 

});

router.post("/modify", function (request, response) { 

  let req_id = request.session.display.id;
  let modi_pw = request.body.modi_pw;
  let modi_phone = request.body.modi_phone;


    let sql = "update USERS set USER_PWD=?,USER_PHONE=? where user_id=?";
    conn.query(sql,[modi_pw,modi_phone, req_id], function(err,row){
      if(!err){
          alert('수정이 완료되었습니다!')
      }else{
        console.log(err);
      }
    })

});

router.post("/modify2", function(request, response){
  let req_id = request.session.display.id;
  let modi_com = request.body.modi_com;
  let modi_dept = request.body.modi_dept;
  let modi_req = request.body.modi_req;

  let sql = "update applyinfos set company=?, dept_name=?, REQUIREMENTS=? where user_id=?"
  conn.query(sql,[modi_com, modi_dept, modi_req], function(err,row){
    if(!err){
      alert('수정이 완료되었습니다!')
    }else{
      console.log(err);
    }
  })
})

router.get("/bloginfosearchblog", function (request, response) { // 블로그 게시글 전체 조회 라우터 
  
  //let req_id = request.session.display.id;

  let sql = "select * from bloginfos where blog_num > 0"; // 블로그 글 순번에 따른 기록된 게시글 제목, 내용, 아이디, 작성일자, 조회수

  conn.query(sql,function(err,row){
    if(!err){
              response.render('blog.html',{
              row:row
              })

        console.log(row);

    }else{
        console.log(err);
        response.redirect("main.html");
    }
  })
});

router.get("/bloginfosearchblogdetails", function (request, response) { // 블로그 수행기 전체 조회 라우터 
  
    //let req_id = request.session.display.id;
  
    let sql = "select * from bloginfos where blog_num = 1"; // 블로그 글 순번에 따른 기록된 게시글 제목, 내용, 아이디, 작성일자, 조회수
  
    conn.query(sql,function(err,row){
      if(!err){
                response.render('blog_details',{
                row:row
                })
  
      }else{
          console.log(err);
          response.redirect("main.html");
      }
    })
  });

router.get("/bloginfosearchblogdtechnique", function (request, response) { // 블로그 기술동향 전체 조회 라우터 
  
    //let req_id = request.session.display.id;
  
    let sql = "select * from bloginfos where blog_num = 2"; // 블로그 글 순번에 따른 기록된 게시글 제목, 내용, 아이디, 작성일자, 조회수
  
    conn.query(sql,function(err,row){
      if(!err){
                response.render('blog_technique',{
                row:row
                })
  
      }else{
          console.log(err);
          response.redirect("main.html");
      }
    })
  });

router.post("/replyinsert", function (request, response) { // 댓글 삽입하는 라우터 
    console.log();
    let reply_content = request.body.content; // 댓글내용
    let id =  request.session.display.id;// 웹에서 받아온 유저 아이디 값
    let ARTICLE_SEQ = request.body.ARTICLE_SEQ; // 원글순번
    //let reg_date = typeof request.body.reg_date === 'undefinde' ? 0 : request.body.reg_date;
  
    let sql = "";
    let sql2 = "";
    sql = "insert into replies(ARTICLE_SEQ, REPLY_CONTENT, USER_ID, REG_DATE, DELETE_LEVEL) values ( ?, ?, ?, now(), 7)"; // 댓글 삽입
    sql2 = "select * from REPLIES where ARTICLE_SEQ=?";
  
    conn.query(sql,[ARTICLE_SEQ,reply_content,id],  function(err,row){
      if(!err){
          console.log("댓글 작성 성공");
          conn.query(sql2,[ARTICLE_SEQ], function(err1,row1){
              if(!err1){
                  console.log(row1);
                  response.send(row1);
              }
          })
          //response.render('main.html', {file:request.file, files:null});
          //response.redirect("http://59.0.234.126:3700/blog_details.html");// 댓글 조회 페이지 이동
          return "ok";
      }else{
          console.log("댓글 작성 실패.");
          console.log(err);
          //response.redirect("http://59.0.234.126:3700/blog_details.html"); // 댓글 작성 페이지 이동
          return "fail";
      }
  })
  
  
  });
  
router.post("/replysearch", function (request, response) { // 댓글 조회 라우터 
    
      //let num = request.query.ARTICLE_SEQ;
      let num = request.body.ARTICLE_SEQ;
      console.log(num);
      
      let sql = "";
      sql = "select REPLY_CONTENT, USER_ID, REG_DATE from replies where ARTICLE_SEQ = ?"; // 댓글 조회
      
    
      conn.query(sql,[num],  function(err,row1){
        if(!err){
          
          response.send(row1);
            return "ok";
        }else{
            console.log("댓글 조회 실패.");
            console.log(err);
            //response.redirect("http://59.0.234.126:3700/blog_details.html"); // 댓글 작성 페이지 이동
            return "fail";
        }
    })
  });

router.get('/blog_reply', function(req, res){
    let num = req.query.ARTICLE_SEQ;
    console.log(num);

    let sql = "";
    let sql2 = "";
    sql = "select * from bloginfos where article_seq="+num+ " and blog_num > 0";
    sql2 = "select * from REPLIES where article_seq = ?";
    conn.query(sql,function(err,row){
        if(!err){
            
            
          conn.query(sql2,[num],function(err1,row1){
            console.log(row1);
            res.render('blog_reply',{
              row:row,
              row1:row1
            })
          })
           
        }else{
            console.log("fail");
            console.log(err);
           
        }
    }) 

});

router.get('/blog_details_reply', function(req, res){
    let num = req.query.ARTICLE_SEQ;
    console.log(num);

    let sql = "";
    sql = "select * from bloginfos where article_seq="+num+ " and blog_num = 1";
    sql2 = "select * from REPLIES where article_seq = ?";
    conn.query(sql,function(err,row){
        if(!err){

          conn.query(sql2,[num],function(err1,row1){
            console.log(row1);
            res.render('blog_details_reply',{
              row:row,
              row1:row1
            })
          })
            
           
        }else{
            console.log("fail");
            console.log(err);
           
        }
    }) 
});

router.get('/blog_technique_reply', function(req, res){
    let num = req.query.ARTICLE_SEQ;
    console.log(num);

    let sql = "";
    sql = "select * from bloginfos where article_seq="+num+ " and blog_num = 2";

    conn.query(sql,function(err,row){
        if(!err){
            console.log(row);
            res.render('blog_technique_reply',{
                row:row
            });
           
        }else{
            console.log("fail");
            console.log(err);
           
        }
    }) 
});


router.get('/img', function(req,res){
  return res.render('img')
});


router.post('/label_info', function(req,res){

  // console.log(req.body.stX, req.body.stY, req.body.edX, req.body.edY);
  console.log();
  res.send('gd');
});

router.post('/saveImage', function(req, res){
  console.log('hi');

  let path_2 = './uploadedFiles/1634365503564/rep/'
  mkdirp('./uploadedFiles/1634365503564/rep');

  console.log(req.body.a);
  let img = req.body.img;
  let base64Data = img.replace(/^data:image\/\w+;base64,/,"");
  let dataBuffer = new Buffer(base64Data, 'base64');
  let path_1 = path_2+Date.now()+".png"
  console.log(path_1);
         // flask api 호출
         const requestCall = (callback)=>{
           const options = {
               method: 'POST',
               uri: "http://121.147.0.247:9000/test",
               qs: {

                  'filepath': path_1
               }
           }
          console.log('실행중');
           request1(options, function (err, res) {
               callback(undefined, {
                   result:res
               });
               
              
           });
         }

       requestCall((err, {result}={})=>{
           if(err){
               console.log("error!!!!");
               response.send({
                   message: "fail",
                   status: "fail"
               });
           }
           console.log('result: '+ result);
           console.log(req.body.stX, req.body.stY, req.body.edX, req.body.edY)
           fs.writeFileSync(path_1, dataBuffer, function(err){
             })
           
           
           res.send('dtd')


       })

})

router.get('/index.html',function(req,res){
  res.render('main.html')
})

router.post('/project_result',function(req,res){
  console.log('hi');
  console.log(req.body);
  console.log(req.body.folder_name);

  var temp = new Array();
  var stX = req.body['stX[]']
  var stY = req.body['stY[]']
  var edX = req.body['edX[]']
  var edY = req.body['edY[]']


  temp.push(stX, stY, edX, edY)
  console.log(temp);
  const row = temp.length;
  const col = temp[0].length;
  const transposed = Array.from({ length: col }, () => new Array(row).fill(0));
  
  for(let i = 0; i < row; i++) {
    for(let j = 0; j < col; j++) {
      [transposed[j][i]] = [temp[i][j]];
    }
  }
  console.log(transposed); 



  
  res.render('project_result')
})

router.get('/leaderboard',function(req,res){
  let id = req.session.display.id;
  sql = "select * from applyinfos where user_id=?"

  conn.query(sql,[id], function(err,row){
    if(!err){
      console.log(row);
        res.render('leaderboard',{
          row:row
        })
    }else{
        
    }
  })
});



module.exports = router;