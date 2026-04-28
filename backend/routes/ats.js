const express = require('express');
const router = express.Router();
const { checkATS, checkATSFile } = require('../controllers/atsController');
const { uploadAny } = require('../middleware/upload');

// POST /api/ats       — plain text check
router.post('/', checkATS);

// POST /api/ats/upload — PDF / DOCX file upload
router.post('/upload', uploadAny.single('resume'), checkATSFile);

module.exports = router;
