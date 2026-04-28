import { useState, useRef, useCallback } from 'react'
import { FileOutput, Upload, X, GripVertical, Download, CheckCircle, FileImage, ArrowUp, ArrowDown, Layers } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import { Spinner } from '../../components/common/Skeleton'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import toast from 'react-hot-toast'

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const PAGE_SIZES = [
  { id: 'fit',  label: 'Fit to Image',  desc: 'Page = image size' },
  { id: 'a4',   label: 'A4 Portrait',   desc: '210 × 297 mm' },
  { id: 'a4l',  label: 'A4 Landscape',  desc: '297 × 210 mm' },
  { id: 'letter', label: 'US Letter',   desc: '8.5 × 11 in' },
]

let itemCounter = 0
function makeItem(file) {
  return { id: `img-${++itemCounter}`, file, preview: URL.createObjectURL(file) }
}

export default function ImageToPdf() {
  const [items, setItems] = useState([])
  const [pageSize, setPageSize] = useState('fit')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef()

  const addFiles = useCallback((fileList) => {
    const arr = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    if (!arr.length) return toast.error('Only image files allowed')
    const oversized = arr.find(f => f.size > 20 * 1024 * 1024)
    if (oversized) return toast.error(`"${oversized.name}" exceeds 20MB`)
    setItems(prev => {
      const existing = new Set(prev.map(i => `${i.file.name}-${i.file.size}`))
      const newItems = arr
        .filter(f => !existing.has(`${f.name}-${f.size}`))
        .map(makeItem)
      if (!newItems.length) { toast('All selected images already added'); return prev }
      toast.success(`${newItems.length} image${newItems.length > 1 ? 's' : ''} added`)
      return [...prev, ...newItems]
    })
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const moveItem = (id, dir) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  const convert = async () => {
    if (!items.length) return toast.error('Add at least one image')
    setLoading(true); setProgress(0); setResultUrl(null)
    try {
      // Load pdf-lib from CDN
      const { PDFDocument, rgb } = await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.esm.min.js')
      const pdfDoc = await PDFDocument.create()

      // A4 points: 595.28 x 841.89 | Letter: 612 x 792
      const pageDims = {
        a4:     [595.28, 841.89],
        a4l:    [841.89, 595.28],
        letter: [612, 792],
      }

      for (let i = 0; i < items.length; i++) {
        setProgress(Math.round(((i) / items.length) * 90))
        const item = items[i]
        const arrayBuf = await item.file.arrayBuffer()
        const mime = item.file.type

        let embeddedImg
        if (mime === 'image/jpeg' || mime === 'image/jpg') {
          embeddedImg = await pdfDoc.embedJpg(arrayBuf)
        } else {
          // For PNG, WebP, GIF — convert to PNG via canvas first
          const bitmap = await createImageBitmap(item.file)
          const canvas = document.createElement('canvas')
          canvas.width = bitmap.width; canvas.height = bitmap.height
          canvas.getContext('2d').drawImage(bitmap, 0, 0)
          const pngBlob = await new Promise(res => canvas.toBlob(res, 'image/png'))
          const pngBuf = await pngBlob.arrayBuffer()
          embeddedImg = await pdfDoc.embedPng(pngBuf)
        }

        let pw, ph
        if (pageSize === 'fit') {
          pw = embeddedImg.width; ph = embeddedImg.height
        } else {
          [pw, ph] = pageDims[pageSize]
        }

        const page = pdfDoc.addPage([pw, ph])

        // Scale image to fit page while maintaining aspect ratio
        const scale = Math.min(pw / embeddedImg.width, ph / embeddedImg.height)
        const drawW = embeddedImg.width * scale
        const drawH = embeddedImg.height * scale
        const x = (pw - drawW) / 2
        const y = (ph - drawH) / 2

        page.drawImage(embeddedImg, { x, y, width: drawW, height: drawH })
      }

      setProgress(95)
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      setResultUrl(URL.createObjectURL(blob))
      setProgress(100)
      toast.success(`PDF created — ${items.length} page${items.length > 1 ? 's' : ''}!`)
    } catch (err) {
      console.error(err)
      toast.error('PDF creation failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    const a = document.createElement('a'); a.href = resultUrl
    a.download = `toolforge-${items.length}pages.pdf`; a.click()
  }

  return (
    <>
      <SEO
        title="Image to PDF Converter — Free Online Tool"
        description="Convert multiple JPG, PNG, WebP images to PDF online for free. Reorder pages, choose page size, combine up to 20 images instantly in your browser."
        keywords="image to pdf, jpg to pdf, png to pdf, multiple images to pdf, combine images pdf free"
      />
      <ToolPage
        icon="📄"
        title="Image to PDF Converter"
        description="Select up to 20 images, drag to reorder pages, choose page size — then download your PDF instantly. 100% browser-based, nothing uploaded."
        badge="✦ Drag & reorder • A4 / Letter / Fit • No upload"
        affiliateType="canva"
      >
        <div className="space-y-4">

          {/* Drop Zone */}
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
              ${isDragging ? 'border-teal-400 bg-teal-500/10 scale-[1.01]' : 'border-white/15 hover:border-white/30 hover:bg-white/[0.03]'}
              ${items.length > 0 ? 'py-5' : 'py-12'}`}
            onDrop={onDrop}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => { if (e.target.files?.length) { addFiles(e.target.files); e.target.value = '' } }} />
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all
                ${isDragging ? 'bg-teal-500/20 border border-teal-500/40' : 'bg-white/5 border border-white/10'}`}>
                <Upload className={`w-5 h-5 ${isDragging ? 'text-teal-400' : 'text-zinc-500'}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  {items.length > 0 ? '+ Add more images' : 'Drop images here or click to browse'}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">JPEG, PNG, WebP, GIF — up to 20MB each</p>
              </div>
            </div>
          </div>

          {/* Image list — drag to reorder */}
          <AnimatePresence>
            {items.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-semibold text-white">{items.length} Image{items.length > 1 ? 's' : ''}</span>
                    <span className="text-xs text-zinc-600">— {items.length} page PDF</span>
                  </div>
                  <button onClick={() => setItems([])}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
                    Clear all
                  </button>
                </div>

                {/* Reorderable list */}
                <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
                  {items.map((item, idx) => (
                    <Reorder.Item key={item.id} value={item} className="list-none">
                      <motion.div
                        layout
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
                      >
                        {/* Page number */}
                        <span className="text-xs font-mono text-zinc-600 w-5 text-center flex-shrink-0">
                          {idx + 1}
                        </span>

                        {/* Drag handle */}
                        <GripVertical className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors" />

                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
                          <img src={item.preview} alt={item.file.name}
                            className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">{item.file.name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{formatSize(item.file.size)} • Page {idx + 1}</p>
                        </div>

                        {/* Move buttons (mobile-friendly) */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => moveItem(item.id, -1)} disabled={idx === 0}
                            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors disabled:opacity-30">
                            <ArrowUp className="w-3 h-3 text-zinc-400" />
                          </button>
                          <button onClick={() => moveItem(item.id, 1)} disabled={idx === items.length - 1}
                            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors disabled:opacity-30">
                            <ArrowDown className="w-3 h-3 text-zinc-400" />
                          </button>
                          <button onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                            <X className="w-3 h-3 text-zinc-400 hover:text-red-400" />
                          </button>
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Size Selector */}
          <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.07] space-y-3">
            <p className="text-sm font-semibold text-white">Page Size</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAGE_SIZES.map(ps => (
                <button key={ps.id} onClick={() => setPageSize(ps.id)}
                  className={`p-3 rounded-xl text-left transition-all border ${pageSize === ps.id
                    ? 'border-teal-500/50 bg-teal-500/10'
                    : 'border-white/[0.07] hover:border-white/20 bg-white/[0.02]'}`}>
                  <p className="text-xs font-semibold text-white leading-tight">{ps.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{ps.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.07] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-sm text-zinc-300">Creating PDF...</span>
                  </div>
                  <span className="text-xs text-teal-400 font-mono">{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-violet-500"
                    animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                </div>
                <p className="text-xs text-zinc-600">Processing page {Math.ceil(progress / (90 / items.length))} of {items.length}...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Convert Button */}
          <button onClick={convert} disabled={!items.length || loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 py-3.5 text-base">
            {loading
              ? <><Spinner size="sm" /> Creating PDF...</>
              : <><FileOutput className="w-5 h-5" /> Convert {items.length > 0 ? `${items.length} Images` : 'Images'} to PDF</>
            }
          </button>

          {/* Result */}
          <AnimatePresence>
            {resultUrl && (
              <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                className="rounded-2xl p-5 border border-green-500/20 bg-green-500/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">PDF Ready!</p>
                    <p className="text-xs text-zinc-400">{items.length} page{items.length > 1 ? 's' : ''} • Created in your browser</p>
                  </div>
                </div>
                <button onClick={download}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info */}
          <div className="rounded-2xl p-4 bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-sm font-bold text-white mb-2">How it works</h2>
            <div className="space-y-1.5">
              {[
                ['1. Add images', 'Click or drag-drop up to 20 images at once'],
                ['2. Reorder', 'Drag rows or use ↑↓ arrows to set page order'],
                ['3. Page size', 'Choose A4, Letter, or Fit to image dimensions'],
                ['4. Download', 'PDF is created instantly — no server upload needed'],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-2 text-xs">
                  <span className="text-teal-500 font-semibold flex-shrink-0">{t}:</span>
                  <span className="text-zinc-500">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolPage>
    </>
  )
}
