import { useState, useRef, useEffect } from 'react'
import { Download, QrCode, Copy, Check, RefreshCw } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import toast from 'react-hot-toast'

// Uses qrcode.js via CDN script (loaded dynamically)
let QRCodeLib = null

async function loadQR() {
  if (QRCodeLib) return QRCodeLib
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
    s.onload = () => { QRCodeLib = window.QRCode; resolve(window.QRCode) }
    s.onerror = reject
    document.head.appendChild(s)
  })
}

const COLORS = ['#14b8a6','#8b5cf6','#f59e0b','#ef4444','#3b82f6','#10b981','#000000','#ffffff']
const SIZES = [{ label: 'Small (128px)', value: 128 }, { label: 'Medium (256px)', value: 256 }, { label: 'Large (512px)', value: 512 }]
const PRESETS = [
  { label: 'Custom Text', icon: '✏️', placeholder: 'Enter any text or URL...', value: '' },
  { label: 'Website URL', icon: '🌐', placeholder: 'https://yourwebsite.com', value: 'https://' },
  { label: 'WhatsApp', icon: '💬', placeholder: 'Phone number (with country code)', value: 'https://wa.me/' },
  { label: 'Email', icon: '📧', placeholder: 'someone@example.com', value: 'mailto:' },
  { label: 'Phone', icon: '📞', placeholder: '+91 99999 99999', value: 'tel:' },
  { label: 'WiFi', icon: '📶', placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;', value: 'WIFI:T:WPA;S:;P:;;' },
]

export default function QRCodeGenerator() {
  const [text, setText] = useState('https://toolforge.app')
  const [color, setColor] = useState('#14b8a6')
  const [bg, setBg] = useState('#0a0a0a')
  const [size, setSize] = useState(256)
  const [preset, setPreset] = useState(0)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef()
  const qrRef = useRef(null)

  const generate = async () => {
    if (!text.trim()) return
    try {
      const QR = await loadQR()
      if (containerRef.current) containerRef.current.innerHTML = ''
      qrRef.current = new QR(containerRef.current, {
        text: text.trim(),
        width: size,
        height: size,
        colorDark: color,
        colorLight: bg,
        correctLevel: QR.CorrectLevel.H,
      })
    } catch (e) {
      toast.error('Failed to generate QR code')
    }
  }

  useEffect(() => { generate() }, [text, color, bg, size])

  const download = () => {
    const canvas = containerRef.current?.querySelector('canvas')
    if (!canvas) return toast.error('Generate a QR code first')
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'qrcode.png'
    a.click()
    toast.success('Downloaded!')
  }

  const copyText = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard!')
  }

  return (
    <>
      <SEO
        title="Free QR Code Generator — Create QR Codes Instantly"
        description="Generate QR codes for URLs, text, WiFi, WhatsApp, email and more. Free, fast, customizable colors and sizes. Download as PNG."
        keywords="qr code generator free, create qr code, qr code for website, wifi qr code, whatsapp qr code"
      />
      <ToolPage
        icon="📱"
        title="QR Code Generator"
        description="Create QR codes for any URL, text, WiFi, or contact. Customize colors, download instantly — completely free."
        badge="✦ Instant • Custom Colors • PNG Download"
        affiliateType="canva"
      >
        <div className="space-y-4">
          {/* Preset tabs */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => { setPreset(i); setText(p.value) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border
                  ${preset === i ? 'border-teal-500/50 bg-teal-500/10 text-teal-300' : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20'}`}>
                <span>{p.icon}</span>{p.label}
              </button>
            ))}
          </div>

          {/* Text input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Content</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={PRESETS[preset].placeholder}
              rows={3}
              className="w-full rounded-xl px-4 py-3 bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500/50 resize-none"
            />
          </div>

          {/* QR Preview + Controls side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* QR Preview */}
            <div className="rounded-2xl p-5 bg-white/[0.03] border border-white/[0.07] flex flex-col items-center gap-4">
              <div ref={containerRef} className="rounded-xl overflow-hidden" style={{ background: bg }}></div>
              <div className="flex gap-2 w-full">
                <button onClick={download} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm">
                  <Download className="w-4 h-4" /> Download PNG
                </button>
                <button onClick={copyText} className="btn-secondary flex items-center justify-center gap-2 py-2.5 px-3 text-sm">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={generate} className="btn-secondary flex items-center justify-center gap-2 py-2.5 px-3 text-sm">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Size */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map(s => (
                    <button key={s.value} onClick={() => setSize(s.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                        ${size === s.value ? 'border-teal-500/50 bg-teal-500/10 text-teal-300' : 'border-white/10 bg-white/[0.03] text-zinc-400'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Color */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">QR Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ background: c }} />
                  ))}
                  <input type="color" value={color} onChange={e => setColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-white/10" title="Custom color" />
                </div>
              </div>

              {/* Background */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">Background</label>
                <div className="flex flex-wrap gap-2">
                  {['#ffffff','#0a0a0a','#1a1a2e','#f8fafc','#fef3c7'].map(c => (
                    <button key={c} onClick={() => setBg(c)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${bg === c ? 'border-white scale-110' : 'border-transparent border border-white/20'}`}
                      style={{ background: c }} />
                  ))}
                  <input type="color" value={bg} onChange={e => setBg(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-white/10" title="Custom background" />
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['📱 Scan Ready', 'Works on all smartphones and QR scanner apps instantly.'],
              ['🎨 Custom Colors', 'Match your brand — change QR and background colors freely.'],
              ['📶 WiFi QR', 'Share WiFi password without typing — scan to connect!'],
              ['💾 PNG Download', 'High quality PNG — print on business cards, posters, flyers.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.05]">
                <p className="text-xs font-semibold text-white">{title}</p>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ToolPage>
    </>
  )
}
