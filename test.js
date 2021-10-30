// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');

// 파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');


// 익스프레스 객체 생성
var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3050);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더와 uploads 폴더 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
app.use(cors());


//multer 미들웨어 사용 : 미들웨어 사용 순서 중요  body-parser -> multer -> router
// 파일 제한 : 10개, 1G
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        //callback(null, file.originalname + Date.now())
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);
        callback(null, basename + Date.now() + extension);
    }
});

var upload = multer({
    storage: storage, // storage 객체
    limits: {
        files: 10, // 한번에 업로드할 수 있는 파일 개수
        fileSize: 1024 * 1024 * 1024
    }
});


// 라우터 사용하여 라우팅 함수 등록
var router = express.Router();

// 파일 업로드 라우팅 함수
// photo.html 파일에서 action 요청 패스 : /process/photo
router.route('/process/photo').post(upload.array('photo', 1), function(req, res) {
    console.log('/process/photo 라우팅 함수 호출됨.');

    try {
        var files = req.files;

        console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
        console.dir(req.files[0]);
        console.dir('#=====#');

        if(files.length > 0){
            console.dir(files[0]);

            // 현재의 파일 정보를 저장할 변수 선언
            var originalname = '',
                filename = '',
                mimetype = '',
                size = 0;

            if (Array.isArray(files)) {   // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
                console.log("배열에 들어있는 파일 갯수 : %d", files.length);

                for (var i = 0; i < files.length; i++) {
                    originalname = files[i].originalname;
                    filename = files[i].filename;
                    mimetype = files[i].mimetype;
                    size = files[i].size;
                }
            }

            console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', '
                    + mimetype + ', ' + size);

            // 클라이언트에 응답 전송
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h3>파일 업로드 성공</h3>');
            res.write('<hr/>');
            res.write('<p>원본 파일명 : ' + originalname + ' -> 저장 파일명 : ' + filename + '</p>');
            res.write('<p>MIME TYPE : ' + mimetype + '</p>');
            res.write('<p>파일 크기 : ' + size + '</p>');
            res.end();

        } else {
            console.log('파일이 없습니다');
        }
    } catch(err) {
        console.dir(err.stack);
    }

});

app.use('/', router);


// // 404 에러 페이지 처리
// var errorHandler = expressErrorHandler({
//     static: {
//       '404': '/index.html'
//     }
// });

// app.use( expressErrorHandler.httpError(404) );
// app.use( errorHandler );


// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'html'));

app.get('/upload', function(req, res){
  res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
  res.send('Uploaded : '+req.file.filename);
});