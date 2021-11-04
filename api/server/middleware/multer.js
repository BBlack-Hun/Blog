//이미지 저장되는 위치 설정
const path = require('path');
const uploadDir = path.join(__dirname, '../uploads'); // 루트의 uploads위치에 저장한다.

//multer 셋팅
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //이미지가 저장되는 도착지 지정
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    // 게시자 or 파일명.jpg(png) 저장
    const name = req.body.photo ? req.body.photo : req.body.username;
    callback(null, name + '.' + file.mimetype.split('/')[1]);
  },
});

module.exports = multer({ storage: storage });
