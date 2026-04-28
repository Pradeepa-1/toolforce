# ToolForge v6 — Full Upgrade Notes

## What Changed

### 🎬 VideoCompressor
- **FIXED**: Removed `VITE_API_URL` hardcode — now uses relative URLs
- **IMPROVED**: Better progress bar with fake progress animation
- **ADDED**: FFmpeg setup tip for Render deploy (buildpack instructions)
- **IMPROVED**: Shows video metadata (resolution, duration) after file select
- **IMPROVED**: Proper download without localhost reference

### ✍️ CaptionGenerator
- **ADDED**: Tamil tone (🌺 Tamil) — generates Tamil captions
- **ADDED**: "Copy All" button — copies all captions at once
- **ADDED**: "Regenerate" button — get fresh captions without re-typing
- **IMPROVED**: 10 templates per tone (was 7) — more variety
- **IMPROVED**: Count slider (1–5) instead of fixed 3

### #️⃣ HashtagGenerator
- **ADDED**: Tamil niche (🌺 Tamil) — Tamil-specific hashtags
- **ADDED**: "Copy All" button — copies full hashtag set
- **IMPROVED**: Tiered display: High Reach / Medium / Niche (click to copy individually)
- **IMPROVED**: Topic words auto-included as niche tags
- **IMPROVED**: Strategy tip at bottom

### 📝 TextSummarizer
- **IMPROVED**: Position boost algorithm — first/last sentences weighted higher (more accurate)
- **IMPROVED**: Short sentence penalty — avoids selecting 2-word sentences
- **ADDED**: Reading time for original vs summary
- **ADDED**: Sentence count in summary
- **ADDED**: Top 12 keywords with importance highlighting
- **IMPROVED**: Ratio slider goes from 10% to 60%

### 🌺 TamilQuoteGenerator
- No changes needed — URLs were already relative ✅

### 📊 ATSChecker (from v5 fix)
- PDF + DOCX upload support ✅

### ✂️ BackgroundRemover (from v5 fix)
- API_BASE localhost hardcode removed ✅

## Deploy on Render

### Backend
1. New Web Service → connect repo → Root Dir: `backend`
2. Build: `npm install`
3. Start: `node server.js`
4. Add env vars from `.env.example`

### Frontend
1. New Static Site → connect repo → Root Dir: `frontend`
2. Build: `npm install && npm run build`
3. Publish: `dist`
4. Add rewrite rule: `/* → /index.html`

### FFmpeg (for Video Compressor)
Add to Render service environment:
- Use Docker runtime (not Node)
- Or add shell script to install FFmpeg during build:
  ```
  buildCommand: apt-get update && apt-get install -y ffmpeg && npm install
  ```

## Install Dependencies
```bash
cd backend && npm install
cd frontend && npm install
```

## New backend dependencies
- `mammoth` — DOCX text extraction (ATS)
- `pdf-parse` — PDF text extraction (ATS)
