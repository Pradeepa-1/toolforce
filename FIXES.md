# ToolForge v5 — Bug Fixes Applied

## Fix 1: BackgroundRemover — localhost hardcode removed

**Problem:** `API_BASE = 'http://localhost:5000'` was hardcoded in `BackgroundRemover.jsx`.
This caused:
- Image preview to load from `http://localhost:5000/outputs/...` — broken in production
- Download to fetch from localhost — always fails in production

**Fix:** Removed `API_BASE` entirely. All requests now use **relative URLs**:
- Upload: `axios.post('/api/bgremove', ...)` — unchanged (was already relative ✅)
- Preview `src`: `result.downloadUrl` (e.g. `/outputs/bg-removed-xxx.png`) — proxied by Vite in dev, served directly in production
- Download `fetch`: `result.downloadUrl` — same

Backend already returns a relative `downloadUrl`, so no backend changes needed.

---

## Fix 2: ATSChecker — PDF & Word upload support added

**Problem:** ATS Checker only accepted pasted text. Users had to manually copy-paste from their resume.

**Fix:** Added full PDF and DOCX upload support:

### Frontend (`ATSChecker.jsx`)
- Toggle between **"Upload PDF / Word"** and **"Paste Text"** modes
- Drag-and-drop or browse for `.pdf`, `.docx`, `.doc` files
- Sends file via `FormData` to `/api/ats/upload`
- Shows "X characters extracted" badge in results

### Backend (`atsController.js`)
- New `checkATSFile` handler: extracts text from uploaded files using:
  - **`pdf-parse`** for PDF files
  - **`mammoth`** for DOCX/DOC files
- Shared `scoreResume()` function — same scoring logic for both text and file paths
- Auto-cleans uploaded file after extraction
- Error if file has no selectable text (e.g. scanned image PDFs)

### New Route (`routes/ats.js`)
- `POST /api/ats` — existing plain-text endpoint (unchanged)
- `POST /api/ats/upload` — new file upload endpoint

### New Dependencies (`backend/package.json`)
```
"mammoth": "^1.7.2"    — DOCX text extraction
"pdf-parse": "^1.1.1"  — PDF text extraction
```

Run `npm install` in `/backend` to install.

---

## Installation

```bash
cd backend
npm install

cd frontend
npm install
npm run dev
```
