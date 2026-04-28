// routes/compress.js
const express = require('express');
const router = express.Router();
const { uploadImage } = require('../middleware/upload');
const { compressImage } = require('../controllers/compressController');
router.post('/', uploadImage.single('image'), compressImage);
module.exports = router;
