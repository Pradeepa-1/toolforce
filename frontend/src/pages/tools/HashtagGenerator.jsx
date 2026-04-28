import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Hash, Copy, CheckCheck, Sparkles } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import { Spinner } from '../../components/common/Skeleton'
import { motion, AnimatePresence } from 'framer-motion'

const NICHES = [
  { id: 'general',   label: '🌐 General' },
  { id: 'business',  label: '💼 Business' },
  { id: 'lifestyle', label: '🌿 Lifestyle' },
  { id: 'tech',      label: '💻 Tech' },
  { id: 'food',      label: '🍽️ Food' },
  { id: 'fitness',   label: '🏋️ Fitness' },
  { id: 'travel',    label: '✈️ Travel' },
  { id: 'tamil',     label: '🌺 Tamil' },
]

const TIER = {
  high:   { label: '🔴 High Reach',   bg: 'rgba(239,68,68,0.08)',    text: '#f87171',  border: 'rgba(239,68,68,0.2)'    },
  medium: { label: '🟡 Medium Reach', bg: 'rgba(234,179,8,0.08)',    text: '#facc15',  border: 'rgba(234,179,8,0.2)'    },
  low:    { label: '🟢 Niche',        bg: 'rgba(34,197,94,0.08)',    text: '#4ade80',  border: 'rgba(34,197,94,0.2)'    },
}

function HashPill({ tag, color }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(tag)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={copy}
      className="text-xs px-2.5 py-1 rounded-lg font-mono transition-all"
      style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}>
      {copied ? '✓' : tag}
    </button>
  )
}

export default function HashtagGenerator() {
  const [topic, setTopic]   = useState('')
  const [niche, setNiche]   = useState('general')
  const [count, setCount]   = useState(20)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Please enter a topic')
    setLoading(true); setResult(null)
    try {
      const { data } = await axios.post('/api/hashtags', { topic, niche, count })
      if (data.success) {
        setResult(data.data)
        toast.success(`${data.data.total} hashtags generated!`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const copyAll = () => {
    if (!result) return
    navigator.clipboard.writeText(result.all)
    setCopiedAll(true)
    toast.success('All hashtags copied!')
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <>
      <SEO
        title="Free Hashtag Generator — Instagram, Tamil Hashtags"
        description="Generate hashtags for Instagram, Twitter, LinkedIn. Tamil hashtags supported. High, medium, niche tags for maximum reach."
        keywords="hashtag generator free, instagram hashtags, tamil hashtags, best hashtags for instagram"
      />
      <ToolPage
        icon="#️⃣"
        title="Hashtag Generator"
        description="Generate the perfect hashtag mix for maximum reach. High-reach, medium, and niche tags — Tamil support included!"
        badge="✦ Tamil Support • Reach Tiers • Copy All"
        affiliateType="grammarly"
      >
        <div className="space-y-5">
          <div className="card space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Topic or keyword</label>
              <input value={topic} onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. morning workout, digital marketing, Chennai food..."
                className="input-field" />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Niche</label>
              <div className="flex flex-wrap gap-2">
                {NICHES.map(n => (
                  <button key={n.id} onClick={() => setNiche(n.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all border"
                    style={niche === n.id
                      ? { background: 'rgba(20,184,166,0.2)', color: '#14b8a6', borderColor: 'rgba(20,184,166,0.4)' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#71717a', borderColor: 'rgba(255,255,255,0.08)' }}>
                    {n.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Count: <span style={{ color: '#14b8a6' }}>{count}</span></label>
              <input type="range" min={10} max={30} step={5} value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #14b8a6 ${(count-10)/20*100}%, rgba(255,255,255,0.1) ${(count-10)/20*100}%)` }} />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1"><span>10</span><span>30</span></div>
            </div>

            <button onClick={handleGenerate} disabled={!topic.trim() || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Spinner size="sm" /> Generating...</> : <><Hash className="w-4 h-4" /> Generate Hashtags</>}
            </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Copy all bar */}
                <div className="flex items-center justify-between rounded-xl p-3"
                  style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)' }}>
                  <span className="text-sm font-semibold text-white">{result.total} hashtags ready</span>
                  <button onClick={copyAll}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold btn-primary">
                    {copiedAll ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
                  </button>
                </div>

                {/* Tier groups */}
                {[['high','high'],['medium','medium'],['low','low']].map(([key, tierKey]) => result[key]?.length > 0 && (
                  <div key={key} className="card space-y-3">
                    <p className="text-xs font-semibold" style={{ color: TIER[tierKey].text }}>{TIER[tierKey].label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result[key].map(tag => <HashPill key={tag} tag={tag} color={TIER[tierKey]} />)}
                    </div>
                  </div>
                ))}

                {/* Strategy tip */}
                <div className="rounded-xl p-4 text-xs text-zinc-400 leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <strong className="text-zinc-300">💡 Strategy:</strong> Use 5-7 high-reach tags for exposure, 8-10 medium tags for targeted audience, and 5-8 niche tags where you can rank easily. Mix all three for best results.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToolPage>
    </>
  )
}
