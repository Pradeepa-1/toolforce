import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ImageDown, Settings2, Layers } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import FileUpload from '../../components/common/FileUpload'
import DownloadResult from '../../components/common/DownloadResult'
import { Spinner } from '../../components/common/Skeleton'
import ProGate, { ProBadge } from '../../components/common/ProGate'

export default function ImageCompressor() {
  const [file, setFile] = useState(null)
  const [quality, setQuality] = useState(75)
  const [format, setFormat] = useState('jpeg')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleCompress = async () => {
    if (!file) return toast.error('Please upload an image first')
    setLoading(true)
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('quality', quality)
      fd.append('format', format)
      const { data } = await axios.post('/api/compress', fd)
      if (data.success) {
        setResult(data.data)
        toast.success(`Compressed! Saved ${data.data.savings}%`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Compression failed')
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (b) =>
    b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

  return (
    <>
      <SEO
        title="Free Image Compressor — Reduce Image Size Online"
        description="Compress JPEG, PNG, and WebP images online for free. Reduce file size without losing quality. No signup required."
        keywords="image compressor, compress images online, reduce image size, jpeg compressor, png compressor"
      />
      <ToolPage
        icon="🗜️"
        title="Image Compressor"
        description="Compress JPEG, PNG, and WebP images instantly. Reduce file size by up to 90% while maintaining visual quality — completely free."
        badge="✦ Real-time compression powered by Sharp"
        affiliateType="canva"
      >
        <div className="space-y-5">

          {/* ── Step 1: Upload ── */}
          <div className="card">
            <FileUpload
              onFilesSelected={setFile}
              accept="image/jpeg,image/png,image/webp"
              label="Drop your image here"
              hint="JPEG, PNG, WebP supported — Max 10MB"
            />
          </div>

          {/* ── Step 2: Settings ── */}
          <div className="card space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Settings2 className="w-4 h-4" style={{ color: '#14b8a6' }} />
              Compression Settings
            </div>

            {/* Quality slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-zinc-400">Quality</label>
                <span className="text-sm font-mono font-semibold" style={{ color: '#14b8a6' }}>
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #14b8a6 ${quality}%, rgba(255,255,255,0.1) ${quality}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            {/* Format selector */}
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Output Format</label>
              <div className="flex gap-2">
                {['jpeg', 'png', 'webp'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      format === f
                        ? 'text-teal-400 border'
                        : 'glass text-zinc-400 hover:text-white'
                    }`}
                    style={
                      format === f
                        ? { background: 'rgba(20,184,166,0.15)', borderColor: 'rgba(20,184,166,0.3)' }
                        : {}
                    }
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Compress button */}
            <button
              onClick={handleCompress}
              disabled={!file || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Spinner size="sm" /> Compressing...</>
                : <><ImageDown className="w-4 h-4" /> Compress Image</>
              }
            </button>
          </div>

          {/* ── Step 3: Result ── */}
          {result && (
            <DownloadResult
              url={result.downloadUrl}
              filename={`compressed.${result.format}`}
              label="Download Compressed Image"
              meta={{
                'Original': formatSize(result.originalSize),
                'Compressed': formatSize(result.compressedSize),
                'Saved': `${result.savings}%`,
              }}
            />
          )}

          {/* ── Pro gate — clean standalone section (NO absolute overlay) ── */}
          <div>
            {/* Header for the locked section */}
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-semibold text-zinc-400">Batch Compression</span>
              <ProBadge />
            </div>
            {/* ProGate renders as a full standalone card */}
            <ProGate feature="Batch Compression" />
          </div>

          {/* ── SEO Content ── */}
          <section className="card">
            <h2 className="text-lg font-bold text-white mb-3">How to Compress Images Online</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-3">
              Our image compressor uses the industry-standard Sharp library to reduce file size
              while preserving visual fidelity. Whether you need to compress images for your
              website, social media, or email, ToolForge makes it effortless.
            </p>
            <h3 className="text-sm font-semibold text-white mb-2">Why Compress Images?</h3>
            <ul className="text-xs text-zinc-500 space-y-1.5 list-disc pl-4">
              <li>Faster website loading speeds and improved SEO rankings</li>
              <li>Reduced storage costs and bandwidth usage</li>
              <li>Better performance on mobile devices</li>
              <li>Faster email delivery with smaller attachments</li>
            </ul>
          </section>

        </div>
      </ToolPage>
    </>
  )
}
