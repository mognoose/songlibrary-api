const util = require('util');
const multer = require('multer');
const maxSize = 200 * 1024 * 1024;
require('dotenv').config();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + process.env.STORAGE_DIR);
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: {fileSize: maxSize},
}).single('file');

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;