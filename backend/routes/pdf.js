const express = require('express');
const router = express.Router();
const { uploadImage } = require('../middleware/upload');
const { imageToPdf } = require('../controllers/pdfController');
router.post('/', uploadImage.array('images', 10), imageToPdf);
module.exports = router;
