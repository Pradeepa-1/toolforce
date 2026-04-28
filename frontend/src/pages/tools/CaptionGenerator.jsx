import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MessageSquare, Copy, CheckCheck, RefreshCw, Sparkles } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import { Spinner } from '../../components/common/Skeleton'
import { motion, AnimatePresence } from 'framer-motion'

const TONES = [
  { id: 'motivational', label: '💪 Motivational' },
  { id: 'product',      label: '🛍️ Product' },
  { id: 'lifestyle',    label: '🌿 Lifestyle' },
  { id: 'business',     label: '💼 Business' },
  { id: 'food',         label: '🍽️ Food' },
  { id: 'tamil',        label: '🌺 Tamil' },
]

export default function CaptionGenerator() {
  const [topic, setTopic]       = useState('')
  const [tone, setTone]         = useState('motivational')
  const [count, setCount]       = useState(3)
  const [loading, setLoading]   = useState(false)
  const [captions, setCaptions] = useState([])
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Please enter a topic')
    setLoading(true); setCaptions([])
    try {
      const { data } = await axios.post('/api/caption', { topic, tone, count })
      if (data.success) {
        setCaptions(data.data.captions)
        toast.success(`${data.data.captions.length} captions generated!`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast.success('Caption copied!')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(captions.join('\n\n'))
    setCopiedAll(true)
    toast.success('All captions copied!')
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <>
      <SEO
        title="Free Caption Generator — Instagram, Facebook, Tamil Captions"
        description="Generate engaging social media captions for free. Supports motivational, product, lifestyle, business, food, and Tamil captions."
        keywords="caption generator, instagram caption generator, tamil caption generator, social media captions free"
      />
      <ToolPage
        icon="✍️"
        title="Caption Generator"
        description="Generate engaging social media captions for Instagram, Facebook, LinkedIn, and more. Tamil captions supported!"
        badge="✦ Tamil Support • 6 Tones • Copy All"
        affiliateType="grammarly"
      >
        <div className="space-y-5">
          <div className="card space-y-4">

            {/* Topic input */}
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Topic or keyword</label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. my new product launch, morning run, Chennai food..."
                className="input-field"
              />
            </div>

            {/* Tone selector */}
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button key={t.id} onClick={() => setTone(t.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all border"
                    style={tone === t.id
                      ? { background: 'rgba(20,184,166,0.2)', color: '#14b8a6', borderColor: 'rgba(20,184,166,0.4)' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#71717a', borderColor: 'rgba(255,255,255,0.08)' }
                    }>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Count selector */}
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Number of captions: <span style={{ color: '#14b8a6' }}>{count}</span></label>
              <input type="range" min={1} max={5} value={count} onChange={e => setCount(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #14b8a6 ${(count-1)/4*100}%, rgba(255,255,255,0.1) ${(count-1)/4*100}%)` }} />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1"><span>1</span><span>5</span></div>
            </div>

            <button onClick={handleGenerate} disabled={!topic.trim() || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Spinner size="sm" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Captions</>}
            </button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {captions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{captions.length} Captions Generated</p>
                  <div className="flex gap-2">
                    <button onClick={handleCopyAll}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                      style={{ background: 'rgba(20,184,166,0.12)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.25)' }}>
                      {copiedAll ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy All
                    </button>
                    <button onClick={handleGenerate}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#71717a', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Regenerate
                    </button>
                  </div>
                </div>
                {captions.map((caption, idx) => (
                  <motion.div key={idx}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="rounded-xl p-4 relative group"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-sm text-zinc-300 leading-relaxed pr-8">{caption}</p>
                    <button onClick={() => handleCopy(caption, idx)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(20,184,166,0.15)' }}>
                      {copiedIdx === idx
                        ? <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                        : <Copy className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToolPage>
    </>
  )
}
