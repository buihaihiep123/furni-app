const multer = require('multer');

var MyStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'./public/uploads');     
    },
    filename: (req, file, cb)=>{
        console.log(file);
        cb(null, file.originalname)
    },
});
const upload = multer({storage: MyStorage});

module.exports = upload;