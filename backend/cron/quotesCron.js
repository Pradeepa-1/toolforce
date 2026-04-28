const cron = require('node-cron');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { getDailyQuotes } = require('../data/tamilQuotes');

const outputDir = path.join(__dirname, '../outputs/quotes');
const dbPath = path.join(__dirname, '../data/daily_quotes.json');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

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

function wrapText(text, maxChars = 20) {
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

function generateSVG(quote, author, gradient) {
  const width = 800, height = 800;
  const lines = wrapText(quote, 20);
  const lineHeight = 65;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height - totalTextHeight) / 2 - 40;

  const textLines = lines.map((line, i) => `
    <text x="400" y="${startY + i * lineHeight}" text-anchor="middle" dominant-baseline="middle"
      font-size="42" fill="white" font-family="serif" font-weight="bold" filter="url(#shadow)">${line}</text>
  `).join('');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${gradient.from}"/>
        <stop offset="100%" style="stop-color:${gradient.to}"/>
      </linearGradient>
      <linearGradient id="al" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${gradient.accent};stop-opacity:0"/>
        <stop offset="50%" style="stop-color:${gradient.accent};stop-opacity:1"/>
        <stop offset="100%" style="stop-color:${gradient.accent};stop-opacity:0"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/></filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <circle cx="100" cy="100" r="180" fill="${gradient.accent}" opacity="0.06"/>
    <circle cx="700" cy="700" r="200" fill="${gradient.accent}" opacity="0.06"/>
    <rect x="30" y="30" width="740" height="740" rx="20" fill="none" stroke="${gradient.accent}" stroke-width="2" opacity="0.4"/>
    <text x="60" y="140" font-size="160" fill="${gradient.accent}" opacity="0.2" font-family="Georgia">"</text>
    <text x="660" y="720" font-size="160" fill="${gradient.accent}" opacity="0.2" font-family="Georgia">"</text>
    ${textLines}
    <rect x="200" y="${startY + totalTextHeight + 20}" width="400" height="3" rx="2" fill="url(#al)"/>
    <text x="400" y="${startY + totalTextHeight + 60}" text-anchor="middle" font-size="26"
      fill="${gradient.accent}" font-family="serif" font-style="italic">— ${author}</text>
    <text x="400" y="770" text-anchor="middle" font-size="16" fill="white" opacity="0.3"
      font-family="sans-serif" letter-spacing="3">ToolForge.app</text>
  </svg>`;
}

// Load existing quotes to prevent duplicates
function loadExisting() {
  if (!fs.existsSync(dbPath)) return [];
  try { return JSON.parse(fs.readFileSync(dbPath, 'utf8')); }
  catch { return []; }
}

async function generateDailyQuotes() {
  console.log('🕐 Cron: Generating daily Tamil quotes...');
  const existing = loadExisting();
  const existingTexts = new Set(existing.map(q => q.tamil));

  const newQuotes = getDailyQuotes(20).filter(q => !existingTexts.has(q.tamil));
  const generated = [];

  for (const quote of newQuotes) {
    try {
      const gradient = gradients[Math.floor(Math.random() * gradients.length)];
      const svg = generateSVG(quote.tamil, quote.author, gradient);
      const filename = `daily_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.png`;
      const filepath = path.join(outputDir, filename);

      await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(filepath);

      generated.push({
        ...quote,
        imageUrl: `/outputs/quotes/${filename}`,
        generatedAt: new Date().toISOString(),
      });

      await new Promise(r => setTimeout(r, 100)); // Small delay between images
    } catch (err) {
      console.error('Error generating quote image:', err.message);
    }
  }

  // Keep only last 100 quotes
  const updated = [...generated, ...existing].slice(0, 100);
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2));
  console.log(`✅ Cron: Generated ${generated.length} new quote images`);
}

function startCronJobs() {
  // Run twice daily: 6 AM and 6 PM IST
  cron.schedule('0 6 * * *', generateDailyQuotes, { timezone: 'Asia/Kolkata' });
  cron.schedule('0 18 * * *', generateDailyQuotes, { timezone: 'Asia/Kolkata' });
  console.log('⏰ Cron jobs scheduled: 6 AM & 6 PM IST daily');

  // Generate on startup if no quotes exist
  const existing = loadExisting();
  if (existing.length === 0) {
    setTimeout(generateDailyQuotes, 2000);
  }
}

module.exports = { startCronJobs, generateDailyQuotes };
