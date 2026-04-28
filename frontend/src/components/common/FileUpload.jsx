import { useCallback, useState } from 'react'
import { Upload, X, File } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function FileUpload({
  onFilesSelected,
  accept = 'image/*',
  multiple = false,
  maxSize = 10,
  label = 'Drop your file here',
  hint,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')

  const validate = (fileList) => {
    const arr = Array.from(fileList)
    const oversized = arr.find(f => f.size > maxSize * 1024 * 1024)
    if (oversized) {
      setError(`File "${oversized.name}" exceeds ${maxSize}MB limit`)
      return null
    }
    return arr
  }

  const handleFiles = useCallback((fileList, currentFiles) => {
    setError('')
    const valid = validate(fileList)
    if (!valid) return

    if (multiple) {
      // FIX: accumulate files, don't replace
      const existing = currentFiles || []
      const deduped = valid.filter(
        nf => !existing.some(ef => ef.name === nf.name && ef.size === nf.size)
      )
      const merged = [...existing, ...deduped]
      setFiles(merged)
      onFilesSelected(merged)
    } else {
      setFiles([valid[0]])
      onFilesSelected(valid[0])
    }
  }, [multiple, onFilesSelected, maxSize])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length) {
      setFiles(prev => {
        handleFiles(e.dataTransfer.files, prev)
        return prev
      })
    }
  }, [handleFiles])

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)

  const removeFile = (idx) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== idx)
      onFilesSelected(multiple ? updated : null)
      return updated
    })
  }

  const isImage = (f) => f.type.startsWith('image/')

  return (
    <div className="space-y-3">
      <label
        className={`drop-zone px-6 py-8 text-center cursor-pointer select-none ${isDragging ? 'active' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={e => {
            if (e.target.files?.length) {
              setFiles(prev => {
                handleFiles(e.target.files, prev)
                return prev
              })
              e.target.value = ''
            }
          }}
        />
        <motion.div
          animate={{ scale: isDragging ? 1.05 : 1 }}
          className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto"
        >
          <Upload className={`w-5 h-5 ${isDragging ? 'text-brand-400' : 'text-zinc-500'}`} />
        </motion.div>
        <div>
          <p className="text-sm font-medium text-zinc-300">{label}</p>
          <p className="text-xs text-zinc-600 mt-1">
            {hint || `or click to browse — Max ${maxSize}MB`}
          </p>
          {multiple && files.length > 0 && (
            <p className="text-xs text-brand-400 mt-1">+ Click to add more images</p>
          )}
        </div>
      </label>

      {error && <p className="text-xs text-red-400 px-1">{error}</p>}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {multiple && files.length > 1 && (
              <p className="text-xs text-zinc-500 px-1">{files.length} images selected — all will be converted to PDF</p>
            )}
            {files.map((file, idx) => (
              <div key={`${file.name}-${file.size}-${idx}`} className="flex items-center gap-3 p-3 glass rounded-xl">
                {multiple && (
                  <span className="text-xs text-zinc-500 font-mono w-5 text-center flex-shrink-0">#{idx + 1}</span>
                )}
                {isImage(file) ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <File className="w-4 h-4 text-zinc-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500">{formatSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-red-500/20 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X className="w-3 h-3 text-zinc-400 hover:text-red-400" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
