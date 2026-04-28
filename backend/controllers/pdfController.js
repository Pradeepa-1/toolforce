const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const imageToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      // Convert to PNG buffer for pdf-lib compatibility
      const imgBuffer = await sharp(file.path).png().toBuffer();
      const img = await pdfDoc.embedPng(imgBuffer);
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      fs.unlinkSync(file.path);
    }

    const pdfBytes = await pdfDoc.save();
    const outputFileName = `converted_${uuidv4()}.pdf`;
    const outputPath = path.join(__dirname, '../outputs', outputFileName);
    fs.writeFileSync(outputPath, pdfBytes);

    res.json({
      success: true,
      data: {
        downloadUrl: `/outputs/${outputFileName}`,
        pageCount: req.files.length,
      },
    });
  } catch (err) {
    console.error('PDF error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { imageToPdf };
