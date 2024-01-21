const multer = require('multer');
const {v4:uuidv4} = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/upload')
    },
    filename: function (req, file, cb) {
        const uniquefilename = uuidv4()
        cb(null, uniquefilename + path.extname(file.originalname))
    }
})

function fileFilter(req, file, cb) {

    const fileExt = path.extname(file.originalname)
    if(fileExt ==='.png' || fileExt ==='.jpg' || fileExt ==='.jpeg' || fileExt ==='.webp' || fileExt ==='.svg' || fileExt ==='.gif'){
        cb(null, true)
    }else{
        cb(null, false)
    }

}


module.exports = multer({ storage: storage,fileFilter,limits: 2*1024*1024 })