const express = require('express');
const router = express.Router();
const { generateCaptions } = require('../controllers/captionController');
router.post('/', generateCaptions);
module.exports = router;
