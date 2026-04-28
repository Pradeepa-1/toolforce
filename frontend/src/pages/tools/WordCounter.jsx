import { useState, useMemo } from 'react'
import { Copy, RotateCcw, Check, FileText } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import toast from 'react-hot-toast'

function analyze(text) {
  if (!text.trim()) return { words: 0, chars: 0, charsNoSpace: 0, sentences: 0, paragraphs: 0, readTime: 0, lines: 0, uniqueWords: 0, avgWordLen: 0, topWords: [] }

  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const readTime = Math.ceil(words.length / 200)
  const charsNoSpace = text.replace(/\s/g, '').length
  const lines = text.split('\n').length
  const cleanWords = words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean)
  const uniqueWords = new Set(cleanWords).size
  const avgWordLen = cleanWords.length ? (cleanWords.reduce((a, w) => a + w.length, 0) / cleanWords.length).toFixed(1) : 0
  const freq = {}
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','it','this','that','i','you','he','she','they','we'])
  cleanWords.forEach(w => { if (!stopWords.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1 })
  const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8)

  return { words: words.length, chars: text.length, charsNoSpace, sentences: sentences.length, paragraphs: paragraphs.length, readTime, lines, uniqueWords, avgWordLen, topWords }
}

const STATS = [
  { key: 'words',       label: 'Words',        color: 'text-teal-400' },
  { key: 'chars',       label: 'Characters',   color: 'text-violet-400' },
  { key: 'charsNoSpace',label: 'Chars (no space)', color: 'text-blue-400' },
  { key: 'sentences',   label: 'Sentences',    color: 'text-pink-400' },
  { key: 'paragraphs',  label: 'Paragraphs',   color: 'text-amber-400' },
  { key: 'lines',       label: 'Lines',        color: 'text-green-400' },
  { key: 'uniqueWords', label: 'Unique Words', color: 'text-orange-400' },
  { key: 'readTime',    label: 'Read Time (min)', color: 'text-cyan-400' },
]

const TARGETS = [
  { label: 'Tweet', limit: 280, key: 'chars' },
  { label: 'LinkedIn Post', limit: 3000, key: 'chars' },
  { label: 'Blog Post', limit: 1500, key: 'words' },
  { label: 'Essay (5 pages)', limit: 1250, key: 'words' },
]

export default function WordCounter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const stats = useMemo(() => analyze(text), [text])

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  const clear = () => { setText(''); toast('Cleared') }

  return (
    <>
      <SEO
        title="Free Word Counter & Text Analyzer — Count Words, Characters, Sentences"
        description="Count words, characters, sentences, paragraphs instantly. Check reading time, unique words, keyword frequency. Free online word counter tool."
        keywords="word counter, character counter, word count online, text analyzer, reading time calculator, sentence counter"
      />
      <ToolPage
        icon="📝"
        title="Word Counter & Text Analyzer"
        description="Instantly count words, characters, sentences and more. Check reading time, keyword frequency — perfect for essays, tweets, and social posts."
        badge="✦ Instant Analysis • Keyword Frequency • Read Time"
        affiliateType="grammarly"
      >
        <div className="space-y-4">
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Start typing or paste your text here... Analysis updates in real-time."
              rows={9}
              className="w-full rounded-2xl px-4 py-4 bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500/50 resize-none leading-relaxed"
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button onClick={copy} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
              <button onClick={clear} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors">
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            {STATS.map(s => (
              <div key={s.key} className="rounded-xl p-3 bg-white/[0.03] border border-white/[0.07] text-center">
                <p className={`text-lg font-bold ${s.color}`}>{stats[s.key]}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Extra info */}
          <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.07] space-y-2">
            <p className="text-xs font-semibold text-zinc-300">📊 Advanced Stats</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Avg word length</span>
                <span className="text-white font-medium">{stats.avgWordLen} chars</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Reading speed</span>
                <span className="text-white font-medium">~200 wpm</span>
              </div>
            </div>
          </div>

          {/* Target Limits */}
          <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.07] space-y-3">
            <p className="text-xs font-semibold text-zinc-300">🎯 Platform Limits</p>
            <div className="space-y-2">
              {TARGETS.map(t => {
                const val = stats[t.key]
                const pct = Math.min(100, Math.round((val / t.limit) * 100))
                const over = val > t.limit
                return (
                  <div key={t.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">{t.label}</span>
                      <span className={over ? 'text-red-400 font-bold' : 'text-zinc-400'}>
                        {val} / {t.limit} {t.key} {over ? '⚠️ Over limit' : ''}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${over ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-teal-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Keywords */}
          {stats.topWords.length > 0 && (
            <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.07] space-y-3">
              <p className="text-xs font-semibold text-zinc-300">🔑 Top Keywords</p>
              <div className="flex flex-wrap gap-2">
                {stats.topWords.map(([word, count]) => (
                  <span key={word} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs">
                    <span className="text-teal-300 font-medium">{word}</span>
                    <span className="text-zinc-500">×{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ToolPage>
    </>
  )
}
