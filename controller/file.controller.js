const uploadFile = require("../middleware/upload");
const auth = require("../middleware/auth");
const fs = require('fs');
require('dotenv').config();

const upload = async (req, res) => {
    if(!auth(req)) return res.status(401).send({message: "Unauthorized"});

    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 200MB!",
            });
        }
        res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + process.env.STORAGE_DIR;

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        stream: process.env.BASE_URL + '/files/stream/' + file,
        download: process.env.BASE_URL + '/files/download/' + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const stream = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + process.env.STORAGE_DIR;
    const file = directoryPath+fileName
    console.log(file);
    const stat = fs.statSync(file);
    // if (req.headers.range !== undefined) {
    //     var parts = range.replace(/bytes=/, "").split("-");
    
    //     var partial_start = parts[0];
    //     var partial_end = parts[1];
    
    //     if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
    //         return res.sendStatus(500);         
    //     }
    //     // convert string to integer (start)
    //     var start = parseInt(partial_start, 10);
    //     // convert string to integer (end)
    //     // if partial_end doesn't exist, end equals whole file size - 1
    //     var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
    //     // content length
    //     var content_length = (end - start) + 1;
    
    //     res.status(206).header({
    //         'Content-Type': 'audio/mpeg',
    //         'Content-Length': content_length,
    //         'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
    //     });
        
    //     // Read the stream of starting & ending part
    //     readStream = fs.createReadStream(file, {start: start, end: end});
    // } else {
    //     res.header({
    //         'Content-Type': 'audio/mpeg',
    //         'Content-Length': stat.size
    //     });
    //     readStream = fs.createReadStream(file);
    // }
    res.header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });
    readStream = fs.createReadStream(file);
    readStream.pipe(res);
}

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + process.env.STORAGE_DIR;
  
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  };
  
  module.exports = {
    upload,
    getListFiles,
    stream,
    download,
  };