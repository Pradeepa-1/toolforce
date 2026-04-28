import { useState, useRef, useCallback } from 'react'
import { Video, Upload, X, Download, Settings, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import { Spinner } from '../../components/common/Skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'

// ✅ No hardcoded API URL — relative paths work in dev (Vite proxy) and production

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
function formatDur(sec) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const PRESETS = [
  { id: 'web',   label: '🌐 Web / Social', desc: 'Twitter, Instagram, WhatsApp', crf: '28', scale: '1280' },
  { id: 'hd',    label: '🎯 HD Quality',   desc: 'YouTube, Vimeo uploads',       crf: '23', scale: '1920' },
  { id: 'small', label: '🪶 Smallest File', desc: 'Email, quick share',           crf: '35', scale: '854'  },
]

export default function VideoCompressor() {
  const [file, setFile]           = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [preset, setPreset]       = useState('web')
  const [loading, setLoading]     = useState(false)
  const [progress, setProgress]   = useState(0)
  const [progressMsg, setProgressMsg] = useState('')
  const [result, setResult]       = useState(null)
  const [videoMeta, setVideoMeta] = useState(null)
  const [downloaded, setDownloaded] = useState(false)
  const inputRef = useRef()
  const timerRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f) return
    if (!f.type.startsWith('video/')) return toast.error('Please select a video file')
    if (f.size > 500 * 1024 * 1024) return toast.error('Max 500MB per video')
    setFile(f); setResult(null); setVideoMeta(null)
    const url = URL.createObjectURL(f)
    const vid = document.createElement('video')
    vid.src = url
    vid.onloadedmetadata = () => {
      setVideoMeta({ duration: vid.duration, width: vid.videoWidth, height: vid.videoHeight })
      URL.revokeObjectURL(url)
    }
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }, [handleFile])

  const fakeProgress = (from, to, label, duration) => {
    setProgressMsg(label)
    setProgress(from)
    clearInterval(timerRef.current)
    const step = (to - from) / (duration / 300)
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= to) { clearInterval(timerRef.current); return to }
        return Math.min(to, prev + step)
      })
    }, 300)
  }

  const compress = async () => {
    if (!file) return
    setLoading(true); setProgress(0); setResult(null)

    const formData = new FormData()
    formData.append('video', file)
    const p = PRESETS.find(x => x.id === preset)
    formData.append('crf', p.crf)
    formData.append('scale', p.scale)

    try {
      fakeProgress(0, 30, 'Uploading video...', 3000)
      fakeProgress(30, 85, 'Compressing video (this may take a minute)...', 20000)

      const { data } = await axios.post('/api/video-compress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 15 * 60 * 1000,
      })

      clearInterval(timerRef.current)
      setProgress(100)
      setProgressMsg('Done!')

      if (data.success) {
        setResult(data.data)
        toast.success(`Compressed! Saved ${data.data.savings}%`)
      }
    } catch (err) {
      clearInterval(timerRef.current)
      const msg = err.response?.data?.message || 'Compression failed'
      // FFmpeg not installed — show helpful message
      if (msg.toLowerCase().includes('ffmpeg')) {
        toast.error('FFmpeg not installed on server. See README for setup.', { duration: 6000 })
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const download = async () => {
    if (!result) return
    try {
      const res = await fetch(result.downloadUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'compressed-video.mp4'
      a.click(); URL.revokeObjectURL(url)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
      toast.success('Downloaded!')
    } catch { toast.error('Download failed') }
  }

  return (
    <>
      <SEO
        title="Free Video Compressor — Compress MP4 Online"
        description="Compress MP4, MOV, AVI videos online free. Reduce video file size for WhatsApp, Instagram, email. Server-side FFmpeg compression."
        keywords="video compressor online free, compress mp4, reduce video size, video size reducer"
        canonical="/tools/video-compressor"
        toolName="Free Video Compressor"
        toolDescription="Compress MP4, MOV, AVI videos online free. Reduce video file size for WhatsApp, Instagram, email."
      />
      <ToolPage
        icon="🎬"
        title="Video Compressor"
        description="Reduce video file size for social media, email, and web. Choose your quality preset and download a compressed MP4 — free."
        badge="✦ Server-side FFmpeg • MP4 Output"
        affiliateType="canva"
      >
        <div className="space-y-5">

          {/* FFmpeg note */}
          <div className="flex items-start gap-3 rounded-xl p-3" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.2)' }}>
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-yellow-400" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300">Render deploy:</strong> FFmpeg must be installed on your server.
              Add <code className="text-yellow-300 bg-white/5 px-1 rounded">buildpacks: ["https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest"]</code> to <code className="text-yellow-300 bg-white/5 px-1 rounded">render.yaml</code>.
            </p>
          </div>

          {/* Upload zone */}
          <div className="card">
            {!file ? (
              <label
                className={`drop-zone px-6 py-10 text-center cursor-pointer flex flex-col items-center ${isDragging ? 'active' : ''}`}
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
              >
                <input ref={inputRef} type="file" accept="video/*" className="hidden"
                  onChange={e => handleFile(e.target.files?.[0])} />
                <motion.div animate={{ scale: isDragging ? 1.08 : 1 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.2)' }}>
                  <Upload className="w-6 h-6" style={{ color: isDragging ? '#14b8a6' : '#71717a' }} />
                </motion.div>
                <p className="text-sm font-medium text-zinc-300 mb-1">{isDragging ? 'Drop to upload!' : 'Drop your video here'}</p>
                <p className="text-xs text-zinc-600 mb-4">MP4, MOV, AVI, WebM — Max 500MB</p>
                <span className="btn-secondary text-xs py-2 px-4">Browse Files</span>
              </label>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Video Ready</span>
                  <button onClick={() => { setFile(null); setResult(null) }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
                <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.15)' }}>
                  <Video className="w-8 h-8 text-teal-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500">
                      {formatSize(file.size)}
                      {videoMeta && ` • ${videoMeta.width}×${videoMeta.height} • ${formatDur(videoMeta.duration)}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preset selector */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Settings className="w-4 h-4" style={{ color: '#14b8a6' }} />
              Quality Preset
            </div>
            <div className="space-y-2">
              {PRESETS.map(p => (
                <button key={p.id} onClick={() => setPreset(p.id)}
                  className="w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all"
                  style={preset === p.id
                    ? { background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.35)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${preset === p.id ? 'border-teal-400' : 'border-zinc-600'}`}>
                    {preset === p.id && <div className="w-2 h-2 rounded-full bg-teal-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{p.label}</p>
                    <p className="text-xs text-zinc-500">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Compress button */}
            <button onClick={compress} disabled={!file || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Spinner size="sm" /> {progressMsg || 'Compressing...'}</> : <><Video className="w-4 h-4" /> Compress Video</>}
            </button>

            {/* Progress bar */}
            {loading && (
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-violet-500"
                    animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                </div>
                <p className="text-[10px] text-zinc-500 text-center">{Math.round(progress)}%</p>
              </div>
            )}
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: 'rgba(20,184,166,0.25)', background: 'linear-gradient(135deg,rgba(20,184,166,0.06),rgba(139,92,246,0.06))' }}>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-teal-400" />
                    <span className="font-semibold text-white text-sm">Compression Complete!</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      ['Original',   formatSize(result.originalSize)],
                      ['Compressed', formatSize(result.compressedSize)],
                      ['Saved',      result.savings + '%'],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <p className="text-xs text-zinc-500 mb-1">{k}</p>
                        <p className="text-sm font-bold text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={download} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    {downloaded ? '✓ Downloaded!' : 'Download Compressed MP4'}
                  </button>
                  <p className="text-center text-[10px] text-zinc-600 mt-2">Auto-deleted after 1 hour</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </ToolPage>
    </>
  )
}
