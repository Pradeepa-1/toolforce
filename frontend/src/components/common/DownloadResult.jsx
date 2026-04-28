import { Download, CheckCircle } from 'lucide-react'
import { useState } from 'react'

// Backend runs on port 5000 — files served from /outputs
const API_BASE = 'http://localhost:5000'

export default function DownloadResult({ url, filename, meta = {}, label = 'Download Result' }) {
  const [downloaded, setDownloaded] = useState(false)

  // url from backend is like "/outputs/filename.jpg"
  // Vite proxies /outputs → localhost:5000 in dev
  // In production, replace API_BASE with your server's URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`

  const handleDownload = async () => {
    try {
      // Fetch the file as blob so browser saves it with the right filename
      const response = await fetch(fullUrl)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = filename || 'toolforge-output'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objectUrl)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch {
      // Fallback: direct link
      const a = document.createElement('a')
      a.href = fullUrl
      a.download = filename || 'toolforge-output'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: 'rgba(20,184,166,0.25)',
        background: 'linear-gradient(135deg,rgba(20,184,166,0.06),rgba(139,92,246,0.06))',
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5" style={{ color: '#14b8a6' }} />
          <span className="font-semibold text-white text-sm">Processing Complete!</span>
        </div>

        {/* Meta stats */}
        {Object.keys(meta).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {Object.entries(meta).map(([k, v]) => (
              <div key={k} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-xs text-zinc-500 mb-1">{k}</p>
                <p className={`text-sm font-semibold ${k === 'Saved' || k === 'Reduced by' ? 'text-teal-400' : 'text-white'}`}>
                  {v}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="btn-primary w-full flex items-center justify-center gap-2"
          style={downloaded ? { opacity: 0.8 } : {}}
        >
          <Download className="w-4 h-4" />
          {downloaded ? '✓ Downloaded!' : label}
        </button>

        <p className="text-center text-[10px] text-zinc-600 mt-2">
          Files are automatically deleted from server after 1 hour
        </p>
      </div>
    </div>
  )
}
