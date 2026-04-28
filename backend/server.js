const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload/output dirs exist
const uploadDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'outputs');
[uploadDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/outputs', express.static(outputDir));

// Routes
app.use('/api/compress', require('./routes/compress'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/summarize', require('./routes/summarize'));
app.use('/api/ats', require('./routes/ats'));
app.use('/api/caption', require('./routes/caption'));
app.use('/api/hashtags', require('./routes/hashtags'));
app.use('/api/bgremove', require('./routes/bgremove'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/tamil-quote', require('./routes/tamilQuote'));
app.use('/api/video-compress', require('./routes/videoCompress'));

// Start cron jobs
require('./cron/quotesCron').startCronJobs();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ToolForge API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ToolForge API running on http://localhost:${PORT}`);
});
