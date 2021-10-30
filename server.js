
const fs = require('fs');
const express = require('express')
    , http = require('http')
    , path = require('path');
const router = express.Router();
const multer = require('multer');
const uploader = multer({ dest: 'uploads/' });

const app = express();


const server = http.createServer((req, res) => {
console.log(req.url, req.method);
//set header content type
res.setHeader('Content-Type', 'text/html');
// res.write('Welcome to ckmobile');
fs.readFile('index.ejs', (err, data) => {
if (err) {
console.log(err)
res.end()
} else {
res.end(data);
}
})
})

// router.post('/upload_page', uploader.single('유빈'),(req, res, nex)=>{
//     console.log('파일 업로드');
//     res.redirect('/');
// });

// module.exports = router;


server.listen(3000, 'localhost', () => {
console.log('listening for request on port 3000');
})
