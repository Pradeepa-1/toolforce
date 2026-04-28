# ToolForge — All-in-One Free Online Tools Platform

A production-ready, full-stack SaaS platform with 8 free online tools, built for high traffic, AdSense approval, affiliate monetization, and future premium tiers.

---

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Edit as needed
npm run dev            # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # Starts on http://localhost:5173
```

Open **http://localhost:5173** — the frontend proxies `/api` and `/outputs` calls to the backend automatically.

---

## 📁 Project Structure

```
toolforge/
├── backend/
│   ├── controllers/
│   │   ├── compressController.js   # Sharp image compression
│   │   ├── pdfController.js        # pdf-lib image→PDF
│   │   ├── summarizeController.js  # Natural.js TF-IDF summarization
│   │   ├── atsController.js        # Resume ATS keyword scoring
│   │   └── captionController.js    # Caption + hashtag generation
│   ├── routes/
│   │   ├── compress.js             # POST /api/compress
│   │   ├── pdf.js                  # POST /api/pdf
│   │   ├── summarize.js            # POST /api/summarize
│   │   ├── ats.js                  # POST /api/ats
│   │   ├── caption.js              # POST /api/caption
│   │   └── hashtags.js             # POST /api/hashtags
│   ├── middleware/
│   │   └── upload.js               # Multer config (10MB images, 20MB files)
│   ├── uploads/                    # Temp upload dir (auto-created)
│   ├── outputs/                    # Processed file output (auto-created)
│   ├── server.js                   # Express app entry
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ads/
    │   │   │   └── AdSlot.jsx           # Google AdSense placeholder
    │   │   ├── affiliate/
    │   │   │   └── AffiliateCard.jsx    # Affiliate card (type-based or named props)
    │   │   └── common/
    │   │       ├── Layout.jsx           # App shell with ad slots
    │   │       ├── Navbar.jsx           # Responsive nav with tools dropdown
    │   │       ├── Footer.jsx           # Full sitemap footer
    │   │       ├── SEO.jsx              # React Helmet SEO wrapper
    │   │       ├── ToolPage.jsx         # Tool page layout (ad sidebar, header)
    │   │       ├── FileUpload.jsx       # Drag-and-drop upload with previews
    │   │       ├── DownloadResult.jsx   # Download card with metadata
    │   │       ├── ProGate.jsx          # Pro upgrade paywall UI
    │   │       ├── ProUpgrade.jsx       # Blur overlay for locked features
    │   │       └── Skeleton.jsx         # Loading skeleton + spinner
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── About.jsx
    │   │   ├── Contact.jsx
    │   │   ├── PrivacyPolicy.jsx       # Required for AdSense
    │   │   ├── Terms.jsx
    │   │   ├── Blog.jsx
    │   │   ├── BlogPost.jsx            # Dynamic, SEO-rich blog posts
    │   │   └── tools/
    │   │       ├── ImageCompressor.jsx  # Real backend integration
    │   │       ├── ImageToPdf.jsx       # Real backend integration
    │   │       ├── BackgroundRemover.jsx # UI + API integration guide
    │   │       ├── VideoCompressor.jsx  # UI + FFmpeg integration guide
    │   │       ├── TextSummarizer.jsx   # Real backend integration
    │   │       ├── ATSChecker.jsx       # Real backend integration
    │   │       ├── CaptionGenerator.jsx # Real backend integration
    │   │       └── HashtagGenerator.jsx # Real backend integration
    │   ├── styles/
    │   │   └── globals.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint          | Description                      | Upload Type     |
|--------|-------------------|----------------------------------|-----------------|
| POST   | /api/compress     | Compress image with Sharp        | `image` (file)  |
| POST   | /api/pdf          | Convert images to PDF            | `images[]` (files) |
| POST   | /api/summarize    | Summarize text with TF-IDF       | JSON body        |
| POST   | /api/ats          | ATS resume score + keywords      | JSON body        |
| POST   | /api/caption      | Generate social media captions   | JSON body        |
| POST   | /api/hashtags     | Generate hashtag sets            | JSON body        |
| GET    | /api/health       | Health check                     | —               |

---

## 💰 Monetization Setup

### 1. Google AdSense
Ad slots are pre-configured in:
- `components/ads/AdSlot.jsx` — reusable component
- `Layout.jsx` — top banner + bottom banner
- `ToolPage.jsx` — in-content + sidebar rectangle
- `Blog.jsx` / `BlogPost.jsx` — in-article ads

**To activate:** Replace the placeholder div in `AdSlot.jsx` with your actual AdSense `<ins>` tag after approval.

### 2. Affiliate Links
Pre-configured in `components/affiliate/AffiliateCard.jsx`:
- **affiliateData** map with 7 pre-built affiliate slots
- Disclosed with "Sponsored" badge (FTC compliant)
- Replace `href: '#affiliate-xxx'` with real tracked affiliate URLs
- Add UTM parameters: `?utm_source=toolforge&utm_medium=affiliate&utm_campaign=tool-name`

### 3. Premium / Pro Model
UI is fully built:
- `ProGate.jsx` — full upgrade modal with feature list
- `ProUpgrade.jsx` — blur overlay for locked features
- Used in ImageCompressor (Batch Compress locked feature)

**To activate payments:** 
```js
// In ProGate.jsx onClick handler:
// integrate payment system here
// Option 1: Stripe Payment Links — https://stripe.com/docs/payment-links
// Option 2: Lemon Squeezy — https://www.lemonsqueezy.com
// Option 3: Paddle — https://www.paddle.com
window.location.href = 'https://buy.stripe.com/your-payment-link'
```

---

## 🤖 Integrating Pending APIs

### Background Remover
Add to `.env`:
```
REMOVE_BG_API_KEY=your_key_here
```
Create `backend/controllers/bgRemoveController.js`:
```js
// integrate API here
const response = await fetch('https://api.remove.bg/v1.0/removebg', {
  method: 'POST',
  headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY },
  body: formData,
})
```

### Video Compressor
```bash
sudo apt install ffmpeg   # Ubuntu/Debian
brew install ffmpeg        # macOS
```
```bash
cd backend && npm install fluent-ffmpeg
```
Create `backend/controllers/videoController.js`:
```js
// integrate API here
const ffmpeg = require('fluent-ffmpeg')
ffmpeg(inputPath).videoCodec('libx264').audioBitrate('128k').save(outputPath)
```

---

## 🔍 SEO Checklist

- [x] Per-page meta title, description, keywords
- [x] React Helmet for head management
- [x] Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`)
- [x] SEO-rich text content on every tool page
- [x] Blog section with keyword-rich long-form posts
- [x] Privacy Policy page (required for AdSense)
- [x] Terms & Conditions page
- [x] Sitemap-friendly URL structure (/tools/tool-name)
- [ ] Add sitemap.xml (generate with `vite-plugin-sitemap`)
- [ ] Submit sitemap to Google Search Console
- [ ] Add robots.txt

---

## 🎨 Design System

**Colors:**
- Brand (teal): `#14b8a6` (brand-500)
- Accent (violet): `#8b5cf6` (accent-500)
- Background: `#080810`
- Surface: `rgba(255,255,255,0.04)`

**Components:**
- `.glass` — frosted glass card
- `.glass-hover` — hover lift effect
- `.btn-primary` — gradient CTA button
- `.btn-secondary` — ghost button
- `.input-field` — styled input
- `.card` — standard card
- `.drop-zone` — file upload zone
- `.gradient-text` — teal→violet text gradient
- `.ad-slot` — AdSense placeholder
- `.skeleton` — shimmer loading state

---

## 🚢 Production Deployment

### Backend (Railway / Render / VPS)
```bash
npm start  # Uses node server.js
```
Set environment variables on your host.

### Frontend (Vercel / Netlify)
```bash
npm run build  # Outputs to dist/
```
Set `VITE_API_URL` if backend is on a different domain, and update vite.config.js proxy.

---

## 📝 License

MIT — use freely for commercial projects.
