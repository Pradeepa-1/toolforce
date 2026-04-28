const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const compressImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { quality = 75, format = 'jpeg' } = req.body;
    const q = Math.min(100, Math.max(1, parseInt(quality)));

    const inputPath = req.file.path;
    const outputFileName = `compressed_${uuidv4()}.${format}`;
    const outputPath = path.join(__dirname, '../outputs', outputFileName);

    const sharpInstance = sharp(inputPath);

    if (format === 'jpeg' || format === 'jpg') {
      await sharpInstance.jpeg({ quality: q }).toFile(outputPath);
    } else if (format === 'png') {
      await sharpInstance.png({ compressionLevel: Math.round((100 - q) / 11) }).toFile(outputPath);
    } else if (format === 'webp') {
      await sharpInstance.webp({ quality: q }).toFile(outputPath);
    } else {
      await sharpInstance.jpeg({ quality: q }).toFile(outputPath);
    }

    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

    // Clean up input file
    fs.unlinkSync(inputPath);

    res.json({
      success: true,
      data: {
        downloadUrl: `/outputs/${outputFileName}`,
        originalSize,
        compressedSize,
        savings: parseFloat(savings),
        format,
      },
    });
  } catch (err) {
    console.error('Compress error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { compressImage };
