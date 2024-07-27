const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const pool = require('../config/db'); 
const format = require('pg-format');
const fs = require('fs');
const path = require('path');
const uploadController = require('../controllers/uploadController');



router.get('/documents', uploadController.getAllDocuments)
router.get('/documents/:id', uploadController.getDocumentsById)
router.post('/upload-single', upload.single('file'), uploadController.uploadSingleFile);

// Multiple files upload
router.post('/upload-multiple', upload.array('files', 10), uploadController.uploadMultipleFiles)



//delete file
router.delete('/delete/:id',uploadController.deleteFile);


//rename file
router.put('/rename/:id', uploadController.renameFile);

module.exports = router;



