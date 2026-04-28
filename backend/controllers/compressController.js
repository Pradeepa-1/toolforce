const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const OUTPUTS_DIR = path.join(__dirname, '../outputs');
const ALLOWED_FORMATS = new Set(['jpeg', 'jpg', 'png', 'webp']);

// Ensure the outputs directory exists once at startup
if (!fs.existsSync(OUTPUTS_DIR)) {
  fs.mkdirSync(OUTPUTS_DIR, { recursive: true });
}

const applyFormat = (sharpInstance, format, quality) => {
  switch (format) {
    case 'png':
      // Sharp compressionLevel: 0 (fast/large) → 9 (slow/small)
      // Map quality 1–100 → compressionLevel 9→0
      return sharpInstance.png({ compressionLevel: Math.round((100 - quality) / 100 * 9) });
    case 'webp':
      return sharpInstance.webp({ quality });
    case 'jpeg':
    case 'jpg':
    default:
      return sharpInstance.jpeg({ quality });
  }
};

const compressImage = async (req, res) => {
  const inputPath = req.file?.path;

  try {
    if (!inputPath) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Sanitize format — reject anything not in the allowlist
    const rawFormat = (req.body.format ?? 'jpeg').toLowerCase();
    const format = ALLOWED_FORMATS.has(rawFormat) ? rawFormat : 'jpeg';

    // Sanitize quality — guard against NaN and out-of-range values
    const parsedQuality = parseInt(req.body.quality, 10);
    const quality = Number.isFinite(parsedQuality)
      ? Math.min(100, Math.max(1, parsedQuality))
      : 75;

    const outputFileName = `compressed_${uuidv4()}.${format}`;
    const outputPath = path.join(OUTPUTS_DIR, outputFileName);

    await applyFormat(sharp(inputPath).withMetadata(false), format, quality)
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    // Clamp to 0 so callers never see a negative savings value
    const savings = Math.max(0, (((originalSize - compressedSize) / originalSize) * 100));

    res.json({
      success: true,
      data: {
        downloadUrl: `/outputs/${outputFileName}`,
        originalSize,
        compressedSize,
        savings: parseFloat(savings.toFixed(1)),
        format,
      },
    });
  } catch (err) {
    console.error('Compress error:', err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    // Always clean up the input temp file, whether we succeeded or failed
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlink(inputPath, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to clean up input file:', unlinkErr);
      });
    }
  }
};

module.exports = { compressImage };
