import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FileText, Copy, CheckCheck, SlidersHorizontal, Clock, Zap } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import { Spinner } from '../../components/common/Skeleton'
import { motion, AnimatePresence } from 'framer-motion'

const SAMPLE_TEXT = `Artificial intelligence (AI) is transforming industries at an unprecedented pace. From healthcare to finance, AI applications are delivering measurable improvements in efficiency, accuracy, and cost savings. Machine learning algorithms can now diagnose diseases from medical images with accuracy matching specialist doctors, predict financial market trends with increasing precision, and automate customer service at scale. However, this rapid advancement raises important questions about job displacement, algorithmic bias, data privacy, and the concentration of AI capabilities in a small number of powerful technology companies. Governments and regulatory bodies worldwide are grappling with how to create frameworks that encourage innovation while protecting citizens from potential harms. The development of general artificial intelligence — systems that can perform any intellectual task a human can — remains a longer-term aspiration, with current systems excelling in specific domains while lacking the flexibility and common sense reasoning of human intelligence.`

export default function TextSummarizer() {
  const [text, setText]   = useState('')
  const [ratio, setRatio] = useState(0.3)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [copied, setCopied]   = useState(false)

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  const handleSummarize = async () => {
    if (!text.trim() || text.trim().length < 50) return toast.error('Please enter at least 50 characters')
    setLoading(true); setResult(null)
    try {
      const { data } = await axios.post('/api/summarize', { text, ratio })
      if (data.success) {
        setResult(data.data)
        toast.success(`Summarized! ${data.data.compressionRatio}% shorter`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Summarization failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.summary)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const ratioLabel = ratio <= 0.2 ? 'Very Short' : ratio <= 0.35 ? 'Balanced' : 'Detailed'

  return (
    <>
      <SEO
        title="Free Text Summarizer — Summarize Articles & Documents"
        description="Summarize long articles, documents, and text online free. NLP-powered — get key sentences, keywords, and reading time."
        keywords="text summarizer free, summarize article online, automatic summarization, text summary generator"
      />
      <ToolPage
        icon="📝"
        title="Text Summarizer"
        description="Paste any article or document and get a concise summary with key insights extracted automatically. Powered by TF-IDF NLP."
        badge="✦ TF-IDF NLP • Keywords • Reading Time"
        affiliateType="grammarly"
      >
        <div className="space-y-5">
          <div className="card space-y-4">

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  Your text
                  {wordCount > 0 && <span className="text-zinc-500 font-normal ml-2">({wordCount} words)</span>}
                </label>
                <button onClick={() => setText(SAMPLE_TEXT)} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Try sample →
                </button>
              </div>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setResult(null) }}
                placeholder="Paste any article, essay, or document here..."
                className="input-field min-h-[180px] resize-none"
              />
            </div>

            {/* Ratio slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-zinc-400">Summary length</label>
                <span className="text-sm font-semibold" style={{ color: '#14b8a6' }}>
                  {Math.round(ratio * 100)}% — {ratioLabel}
                </span>
              </div>
              <input type="range" min={0.1} max={0.6} step={0.05} value={ratio}
                onChange={e => setRatio(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #14b8a6 ${(ratio-0.1)/0.5*100}%, rgba(255,255,255,0.1) ${(ratio-0.1)/0.5*100}%)` }} />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                <span>Very Short</span><span>Detailed</span>
              </div>
            </div>

            <button onClick={handleSummarize} disabled={!text.trim() || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Spinner size="sm" /> Summarizing...</> : <><Zap className="w-4 h-4" /> Summarize</>}
            </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    ['Original',   result.originalWordCount + ' words', 'text-zinc-300'],
                    ['Summary',    result.summaryWordCount + ' words',  'text-teal-400'],
                    ['Reduced',    result.compressionRatio + '%',       'text-green-400'],
                    ['Read Time',  result.summaryReadTime + ' min',     'text-violet-400'],
                  ].map(([label, val, color]) => (
                    <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className={`text-sm font-bold ${color}`}>{val}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-400" />
                      <span className="text-sm font-semibold text-white">Summary</span>
                      <span className="text-xs text-zinc-500">({result.sentenceCount} sentences)</span>
                    </div>
                    <button onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                      style={{ background: 'rgba(20,184,166,0.12)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.25)' }}>
                      {copied ? <><CheckCheck className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{result.summary}</p>
                </div>

                {/* Keywords */}
                {result.keywords?.length > 0 && (
                  <div className="card">
                    <p className="text-sm font-semibold text-white mb-3">🔑 Key Terms</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map((kw, i) => (
                        <span key={kw} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                          style={{
                            background: i < 3 ? 'rgba(20,184,166,0.12)' : 'rgba(255,255,255,0.05)',
                            color: i < 3 ? '#14b8a6' : '#a1a1aa',
                            border: `1px solid ${i < 3 ? 'rgba(20,184,166,0.25)' : 'rgba(255,255,255,0.07)'}`,
                          }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          <section className="card">
            <h2 className="text-lg font-bold text-white mb-2">How It Works</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Our summarizer uses TF-IDF (Term Frequency–Inverse Document Frequency) scoring to rank each sentence by importance. Sentences with the most unique, relevant terms are selected and returned in their original order — giving you a coherent, accurate summary every time.
            </p>
          </section>
        </div>
      </ToolPage>
    </>
  )
}
