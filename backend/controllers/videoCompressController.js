const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const compressVideo = async (req, res) => {
  const inputPath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file uploaded' });
    }

    const crf = req.body.crf || '28';
    const scale = req.body.scale || '1280';

    const outputFileName = `video_${uuidv4()}.mp4`;
    const outputPath = path.join(__dirname, '../outputs', outputFileName);

    // Check if ffmpeg is available
    try {
      await execAsync('ffmpeg -version');
    } catch {
      // ffmpeg not available — return a helpful error
      fs.unlinkSync(inputPath);
      return res.status(503).json({
        success: false,
        message: 'FFmpeg is not installed on this server. Please install FFmpeg to enable video compression.',
      });
    }

    const originalSize = fs.statSync(inputPath).size;

    const cmd = [
      'ffmpeg', '-y',
      '-i', `"${inputPath}"`,
      '-c:v', 'libx264',
      '-crf', crf,
      '-preset', 'fast',
      '-c:a', 'aac',
      '-b:a', '96k',
      '-vf', `"scale='min(${scale},iw)':-2"`,
      '-movflags', '+faststart',
      `"${outputPath}"`,
    ].join(' ');

    await execAsync(cmd, { timeout: 10 * 60 * 1000 }); // 10min timeout

    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }

    const compressedSize = fs.statSync(outputPath).size;
    const savings = parseFloat(((1 - compressedSize / originalSize) * 100).toFixed(1));

    // Clean up input
    fs.unlinkSync(inputPath);

    // Schedule output deletion in 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }, 60 * 60 * 1000);

    res.json({
      success: true,
      data: {
        downloadUrl: `/outputs/${outputFileName}`,
        originalSize,
        compressedSize,
        savings,
      },
    });

  } catch (err) {
    console.error('Video compress error:', err);
    // Clean up on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

    const msg = err.message || 'Video compression failed';
    if (msg.includes('Invalid data') || msg.includes('moov atom') || msg.includes('No such file')) {
      return res.status(400).json({ success: false, message: 'Invalid or corrupted video file. Please try another file.' });
    }
    res.status(500).json({ success: false, message: 'Compression failed. The video format may not be supported.' });
  }
};

module.exports = { compressVideo };
