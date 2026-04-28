const express = require('express');
const router = express.Router();
const { generateHashtags } = require('../controllers/captionController');
router.post('/', generateHashtags);
module.exports = router;
