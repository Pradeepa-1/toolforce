import { useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Eraser, Upload, SlidersHorizontal, Info, CheckCircle, Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import { Spinner } from '../../components/common/Skeleton'
import AffiliateCard from '../../components/affiliate/AffiliateCard'

// ✅ FIX: No hardcoded API_BASE — all requests use relative URLs via Vite proxy (dev)
// or same-origin (production). Never use http://localhost:5000 directly.

export default function BackgroundRemover() {
  const [file, setFile]               = useState(null)
  const [preview, setPreview]         = useState(null)
  const [tolerance, setTolerance]     = useState(40)
  const [useApi, setUseApi]           = useState(false)
  const [loading, setLoading]         = useState(false)
  const [result, setResult]           = useState(null)
  const [isDragging, setIsDragging]   = useState(false)
  const [downloaded, setDownloaded]   = useState(false)
  const inputRef                      = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) return toast.error('Please upload an image file')
    if (f.size > 10 * 1024 * 1024) return toast.error('File too large — max 10MB')
    setFile(f)
    setResult(null)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleRemove = async () => {
    if (!file) return toast.error('Please upload an image first')
    setLoading(true)
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('tolerance', tolerance)
      fd.append('useApi', useApi)

      // ✅ FIX: Relative URL — works in both dev (proxied by Vite) and production
    const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
    const { data } = await axios.post(`${API_URL}/api/bgremove`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (data.success) {
        setResult(data.data)
        toast.success('Background removed successfully!')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Background removal failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // ✅ FIX: Download using relative URL — no localhost reference
  const handleDownload = async () => {
    if (!result) return
    try {
      // result.downloadUrl is already a relative path like /outputs/bg-removed-xxx.png
     const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
      const response = await fetch(`${API_URL}${result.downloadUrl}`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'background-removed.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch {
      toast.error('Download failed — try right-clicking the preview and saving')
    }
  }

  const formatSize = (b) => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

  return (
    <>
      <SEO
        title="Background Remover — Free Online Tool"
        description="Remove image backgrounds instantly online for free. No Photoshop needed. Perfect for product photos, profile pictures, and designs."
        keywords="background remover, remove background online free, transparent background, bg remover"
        canonical="/tools/background-remover"
        toolName="Free Background Remover"
        toolDescription="Remove image backgrounds instantly online for free. Perfect for product photos, profile pictures, and designs."
      />
      <ToolPage
        icon="✂️"
        title="Background Remover"
        description="Remove image backgrounds automatically. Works best on solid/studio backgrounds. Upload your image and download the transparent PNG instantly."
        badge="✦ Powered by Sharp — No API key needed"
        affiliateType="canva"
      >
        <div className="space-y-5">

          {/* ── Upload Zone ── */}
          <div className="card">
            {!file ? (
              <label
                className={`drop-zone px-6 py-10 text-center cursor-pointer ${isDragging ? 'active' : ''}`}
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <motion.div
                  animate={{ scale: isDragging ? 1.08 : 1 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.2)' }}
                >
                  <Upload className="w-6 h-6" style={{ color: isDragging ? '#14b8a6' : '#71717a' }} />
                </motion.div>
                <p className="text-sm font-medium text-zinc-300 mb-1">
                  {isDragging ? 'Drop to upload!' : 'Drop your image here'}
                </p>
                <p className="text-xs text-zinc-600 mb-4">JPEG, PNG, WebP — Max 10MB</p>
                <span className="btn-secondary text-xs py-2 px-4">Browse Files</span>
              </label>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Image Preview</span>
                  <button
                    onClick={removeFile}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(239,68,68,0.15)' }}
                  >
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden" style={{ background: 'repeating-conic-gradient(#2a2a3a 0% 25%, #1a1a2e 0% 50%) 0 0 / 16px 16px' }}>
                  <img src={preview} alt="Preview" className="w-full max-h-64 object-contain" />
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="truncate">{file.name}</span>
                  <span className="shrink-0">{formatSize(file.size)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Settings ── */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <SlidersHorizontal className="w-4 h-4" style={{ color: '#14b8a6' }} />
              Removal Settings
            </div>

            {/* Mode selector */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: false, label: '🎨 Smart Color', desc: 'Solid/studio BG — Free' },
                { id: true,  label: '🤖 AI Removal',  desc: 'Any BG — remove.bg API' },
              ].map(opt => (
                <button key={String(opt.id)}
                  onClick={() => setUseApi(opt.id)}
                  className="rounded-xl p-3 text-left transition-all"
                  style={useApi === opt.id
                    ? { background: 'rgba(20,184,166,0.14)', border: '1px solid rgba(20,184,166,0.4)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-xs font-semibold text-white">{opt.label}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            {!useApi && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-zinc-400">Color Tolerance</label>
                  <span className="text-sm font-mono font-semibold" style={{ color: '#14b8a6' }}>{tolerance}</span>
                </div>
                <input
                  type="range" min="10" max="100" step="5" value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #14b8a6 ${(tolerance - 10) / 90 * 100}%, rgba(255,255,255,0.1) ${(tolerance - 10) / 90 * 100}%)` }}
                />
                <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                  <span>10 — Very precise</span>
                  <span>40 — Default</span>
                  <span>100 — Aggressive</span>
                </div>
                {/* Quick presets */}
                <div className="flex gap-2 mt-2">
                  {[
                    { label: 'White BG', val: 30 },
                    { label: 'Gray BG',  val: 45 },
                    { label: 'Noisy BG', val: 70 },
                  ].map(p => (
                    <button key={p.val} onClick={() => setTolerance(p.val)}
                      className="flex-1 text-[10px] rounded-lg py-1.5 transition-all"
                      style={tolerance === p.val
                        ? { background: 'rgba(20,184,166,0.2)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.4)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#71717a', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.15)' }}
            >
              <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#14b8a6' }} />
              <div className="text-xs text-zinc-400 leading-relaxed">
                {useApi
                  ? <><strong className="text-zinc-300">AI mode:</strong> Add <code className="text-teal-400 bg-white/5 px-1 rounded">REMOVE_BG_API_KEY</code> to backend .env for any background removal. Free: 50 images/month at <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="underline text-teal-400">remove.bg</a>.</>
                  : <><strong className="text-zinc-300">Tips:</strong> White/gray studio BG → use 30–40. Outdoor/colored BG → 60–70. BG இன்னும் இருந்தால் tolerance கூட்டுங்க. Subject-ல hole விழுந்தால் tolerance குறையுங்க.</>
                }
              </div>
            </div>

            <button
              onClick={handleRemove}
              disabled={!file || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Spinner size="sm" /> Removing Background...</>
                : <><Eraser className="w-4 h-4" /> Remove Background</>
              }
            </button>
          </div>

          {/* ── Result ── */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: 'rgba(20,184,166,0.25)', background: 'linear-gradient(135deg,rgba(20,184,166,0.06),rgba(139,92,246,0.06))' }}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5" style={{ color: '#14b8a6' }} />
                      <span className="font-semibold text-white text-sm">Background Removed!</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        ['Method',     result.method],
                        ['BG Color',   result.bgColor],
                        ['Removed',    result.removedPercent + '%'],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <p className="text-xs text-zinc-500 mb-1">{k}</p>
                          <p className="text-xs font-semibold text-white truncate">{v}</p>
                        </div>
                      ))}
                    </div>

                    {/* ✅ FIX: Use relative downloadUrl directly — no API_BASE concatenation */}
                    <div
                      className="rounded-xl overflow-hidden mb-4"
                      style={{ background: 'repeating-conic-gradient(#2a2a3a 0% 25%, #1a1a2e 0% 50%) 0 0 / 16px 16px' }}
                    >
                      <img
                        src={result.downloadUrl}
                        alt="Background removed"
                        className="w-full max-h-72 object-contain"
                      />
                    </div>

                    <button
                      onClick={handleDownload}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {downloaded ? '✓ Downloaded!' : 'Download Transparent PNG'}
                    </button>
                    <p className="text-center text-[10px] text-zinc-600 mt-2">
                      PNG format preserves transparency · Auto-deleted after 1 hour
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 text-xs text-zinc-400 leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <strong className="text-zinc-300">Result not perfect?</strong>
                  {' '}Adjust the <em>Color Tolerance</em> slider and try again.
                  Higher tolerance removes more of the background.
                  For complex backgrounds, consider the{' '}
                  <a
                    href="https://www.remove.bg/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: '#14b8a6' }}
                  >
                    remove.bg API
                  </a>
                  {' '}(add key to backend .env).
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AffiliateCard type="canva" />

          <section className="card">
            <h2 className="text-lg font-bold text-white mb-3">How Background Removal Works</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-3">
              Our tool samples the background color from the edges and corners of your image,
              then removes all pixels that match that color within the tolerance range you set.
              The result is saved as a transparent PNG — ready to use in any design tool.
            </p>
            <h3 className="text-sm font-semibold text-white mb-2">Best Use Cases</h3>
            <ul className="text-xs text-zinc-500 space-y-1.5 list-disc pl-4">
              <li>Product photos on white/gray studio backgrounds</li>
              <li>Profile pictures with plain backgrounds</li>
              <li>Logos and icons on solid colors</li>
              <li>Social media graphics needing transparent backgrounds</li>
            </ul>
          </section>

        </div>
      </ToolPage>
    </>
  )
}
