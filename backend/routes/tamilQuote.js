const express = require('express');
const router = express.Router();
const { generateQuoteImage, getLatestQuotes, getCategories } = require('../controllers/tamilQuoteController');

router.post('/generate', generateQuoteImage);
router.get('/latest', getLatestQuotes);
router.get('/categories', getCategories);

module.exports = router;
