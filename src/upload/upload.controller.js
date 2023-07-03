const express = require('express')
const app = express()
const multer  = require('multer')
const upload = multer()

app.post('/upload', upload.none(), function (req, res, next) {
    req.body.file
})
