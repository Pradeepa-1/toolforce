const express = require('express');
const router = express.Router();
const { uploadImage } = require('../middleware/upload');
const { removeBackground } = require('../controllers/bgRemoveController');

router.post('/', uploadImage.single('image'), removeBackground);

module.exports = router;
