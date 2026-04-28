const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { getQuote, getRandomQuote } = require('../data/tamilQuotes');

const outputDir = path.join(__dirname, '../outputs/quotes');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Gradient backgrounds (teal/purple theme matching ToolForge)
const gradients = [
  { from: '#0f0f1a', to: '#1a0533', accent: '#14b8a6' },
  { from: '#0d1117', to: '#1a1a2e', accent: '#8b5cf6' },
  { from: '#0a1628', to: '#1e3a5f', accent: '#06b6d4' },
  { from: '#1a0a2e', to: '#2d1b69', accent: '#a78bfa' },
  { from: '#0f1923', to: '#1a3a2e', accent: '#10b981' },
  { from: '#1f0a14', to: '#3d1a2e', accent: '#f472b6' },
  { from: '#0a1a0a', to: '#1a3320', accent: '#22c55e' },
  { from: '#1a1000', to: '#3d2800', accent: '#f59e0b' },
];

// Wrap text for SVG (simple word wrap)
function wrapText(text, maxChars = 22) {
  const words = text.split('');
  const lines = [];
  let current = '';
  for (const char of words) {
    current += char;
    if (current.length >= maxChars && (char === ' ' || char === ',' || char === '.' || char === '।')) {
      lines.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

// Generate SVG with Tamil text
function generateSVG(quote, author, gradient) {
  const width = 800;
  const height = 800;
  const lines = wrapText(quote, 20);
  const lineHeight = 65;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height - totalTextHeight) / 2 - 40;

  const textLines = lines.map((line, i) => `
    <text
      x="400"
      y="${startY + i * lineHeight}"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="42"
      fill="white"
      font-family="serif"
      font-weight="bold"
      filter="url(#shadow)"
    >${line}</text>
  `).join('');

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradient.from};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradient.to};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${gradient.accent};stop-opacity:0" />
      <stop offset="50%" style="stop-color:${gradient.accent};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradient.accent};stop-opacity:0" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/>
    </filter>
    <filter id="glowFilter">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="100" cy="100" r="180" fill="${gradient.accent}" opacity="0.06"/>
  <circle cx="700" cy="700" r="200" fill="${gradient.accent}" opacity="0.06"/>
  <circle cx="700" cy="100" r="120" fill="${gradient.accent}" opacity="0.04"/>

  <!-- Border -->
  <rect x="30" y="30" width="740" height="740" rx="20" fill="none" stroke="${gradient.accent}" stroke-width="2" opacity="0.4"/>
  <rect x="40" y="40" width="720" height="720" rx="16" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/>

  <!-- Quote marks -->
  <text x="60" y="140" font-size="160" fill="${gradient.accent}" opacity="0.25" font-family="Georgia, serif">"</text>
  <text x="660" y="720" font-size="160" fill="${gradient.accent}" opacity="0.25" font-family="Georgia, serif">"</text>

  <!-- Tamil text -->
  ${textLines}

  <!-- Accent line -->
  <rect x="200" y="${startY + totalTextHeight + 20}" width="400" height="3" rx="2" fill="url(#accentLine)"/>

  <!-- Author -->
  <text
    x="400"
    y="${startY + totalTextHeight + 60}"
    text-anchor="middle"
    font-size="26"
    fill="${gradient.accent}"
    font-family="serif"
    font-style="italic"
    filter="url(#shadow)"
  >— ${author}</text>

  <!-- ToolForge watermark -->
  <text
    x="400"
    y="770"
    text-anchor="middle"
    font-size="16"
    fill="white"
    opacity="0.3"
    font-family="sans-serif"
    letter-spacing="3"
  >ToolForge.app</text>
</svg>`;
}

// POST /api/tamil-quote/generate
const generateQuoteImage = async (req, res) => {
  try {
    const { keyword = 'motivation' } = req.body;
    const quote = getQuote(keyword);
    const gradient = gradients[Math.floor(Math.random() * gradients.length)];
    const svg = generateSVG(quote.tamil, quote.author, gradient);

    const filename = `quote_${Date.now()}.png`;
    const filepath = path.join(outputDir, filename);

    await sharp(Buffer.from(svg))
      .png({ quality: 90 })
      .toFile(filepath);

    res.json({
      success: true,
      quote: quote.tamil,
      author: quote.author,
      imageUrl: `/outputs/quotes/${filename}`,
    });
  } catch (err) {
    console.error('Quote generation error:', err);
    res.status(500).json({ success: false, message: 'Image generation failed: ' + err.message });
  }
};

// GET /api/tamil-quote/latest
const getLatestQuotes = async (req, res) => {
  try {
    const dbPath = path.join(__dirname, '../data/daily_quotes.json');
    if (!fs.existsSync(dbPath)) {
      return res.json({ success: true, quotes: [] });
    }
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.json({ success: true, quotes: data.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/tamil-quote/categories
const getCategories = async (req, res) => {
  const { getCategories: getCats } = require('../data/tamilQuotes');
  res.json({ success: true, categories: getCats() });
};

module.exports = { generateQuoteImage, getLatestQuotes, getCategories };
