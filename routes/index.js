const controller = require("../controller/file.controller");
const express = require('express');
const router = express.Router();

let routes = app => {
    router.post('/upload', controller.upload);
    router.get('/files', controller.getListFiles);
    router.get('/files/download/:name', controller.download);
    router.get('/files/stream/:name', controller.stream);

    app.use(router)
};

module.exports = routes;