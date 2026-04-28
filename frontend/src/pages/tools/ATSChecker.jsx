import { useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ClipboardCheck, CheckCircle, XCircle, AlertCircle, Upload, X, FileText } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import { Spinner } from '../../components/common/Skeleton'
import AffiliateCard from '../../components/affiliate/AffiliateCard'
import { motion, AnimatePresence } from 'framer-motion'

const GRADE_COLORS = {
  Excellent: 'text-green-400', Good: 'text-brand-400',
  Average: 'text-yellow-400', 'Below Average': 'text-orange-400', Poor: 'text-red-400'
}

const SAMPLE_RESUME = `John Smith | john.smith@email.com | +1 234 567 8901

SUMMARY
Experienced software developer with 5 years of experience building scalable web applications. Led multiple cross-functional teams to deliver projects on time. Strong analytical and problem-solving skills.

EXPERIENCE
Senior Software Developer — TechCorp Inc (2020–Present)
• Developed React and Node.js applications serving 100K+ users
• Implemented microservices architecture reducing latency by 40%
• Led a team of 6 developers across 3 product lines
• Collaborated with product and design teams to deliver 15+ features

SKILLS
JavaScript, TypeScript, React, Node.js, Python, SQL, PostgreSQL, MongoDB, AWS, Docker, Git, Agile, Scrum

EDUCATION
B.Tech Computer Science — State University (2019)`

// Input mode: 'text' | 'file'
export default function ATSChecker() {
  const [mode, setMode]           = useState('file') // default to file upload
  const [resumeText, setResumeText] = useState('')
  const [jobDesc, setJobDesc]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  // File upload state
  const [resumeFile, setResumeFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    const ext = f.name.split('.').pop().toLowerCase()
    if (!allowed.includes(f.type) && !['pdf','docx','doc'].includes(ext)) {
      return toast.error('Please upload a PDF or Word document (.pdf, .docx, .doc)')
    }
    if (f.size > 10 * 1024 * 1024) return toast.error('File too large — max 10MB')
    setResumeFile(f)
    setResult(null)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const removeFile = () => {
    setResumeFile(null)
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleCheck = async () => {
    setLoading(true)
    setResult(null)
    try {
      let data

      if (mode === 'file') {
        // ── File upload mode ──
        if (!resumeFile) return toast.error('Please upload a resume file')
        const fd = new FormData()
        fd.append('resume', resumeFile)
        if (jobDesc.trim()) fd.append('jobDescription', jobDesc)
        const res = await axios.post('/api/ats/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        data = res.data
      } else {
        // ── Text paste mode ──
        if (!resumeText.trim() || resumeText.length < 100)
          return toast.error('Please paste your resume text (min 100 chars)')
        const res = await axios.post('/api/ats', { resumeText, jobDescription: jobDesc })
        data = res.data
      }

      if (data.success) {
        setResult(data.data)
        toast.success(`ATS Score: ${data.data.score}/100`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check failed')
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (b) => b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`
  const fileIcon = resumeFile?.name?.endsWith('.pdf') ? '📄' : '📝'

  return (
    <>
      <SEO
        title="Free ATS Resume Checker — Score Your Resume Online"
        description="Check your resume's ATS compatibility score for free. Upload PDF or Word doc — get keyword analysis, formatting tips, and improvement suggestions."
        keywords="ats resume checker, resume score, ats friendly resume, resume keyword checker, resume analyzer, pdf resume checker"
      />
      <ToolPage
        icon="📊"
        title="ATS Resume Checker"
        description="Analyze your resume against ATS criteria. Upload a PDF or Word doc — or paste your resume text — to get a compatibility score and actionable tips."
        badge="✦ Supports PDF & Word Upload"
        affiliateType="resume"
      >
        <div className="space-y-5">

          {/* ── Mode Toggle ── */}
          <div className="card">
            <div className="flex gap-2 mb-5">
              {[
                { id: 'file', label: '📁 Upload PDF / Word' },
                { id: 'text', label: '📋 Paste Text' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => { setMode(id); setResult(null) }}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all"
                  style={mode === id
                    ? { background: 'rgba(20,184,166,0.2)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.4)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#71717a', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── File Upload ── */}
            {mode === 'file' && (
              <div className="space-y-4">
                {!resumeFile ? (
                  <label
                    className={`drop-zone px-6 py-8 text-center cursor-pointer flex flex-col items-center ${isDragging ? 'active' : ''}`}
                    onDrop={onDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                    <motion.div
                      animate={{ scale: isDragging ? 1.08 : 1 }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.2)' }}
                    >
                      <Upload className="w-6 h-6" style={{ color: isDragging ? '#14b8a6' : '#71717a' }} />
                    </motion.div>
                    <p className="text-sm font-medium text-zinc-300 mb-1">
                      {isDragging ? 'Drop your resume!' : 'Drop your resume here'}
                    </p>
                    <p className="text-xs text-zinc-600 mb-4">PDF, DOCX, DOC — Max 10MB</p>
                    <span className="btn-secondary text-xs py-2 px-4">Browse Files</span>
                  </label>
                ) : (
                  /* File selected */
                  <div
                    className="flex items-center gap-3 rounded-xl p-4"
                    style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)' }}
                  >
                    <span className="text-2xl">{fileIcon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{resumeFile.name}</p>
                      <p className="text-xs text-zinc-500">{formatSize(resumeFile.size)}</p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(239,68,68,0.15)' }}
                    >
                      <X className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Text Paste ── */}
            {mode === 'text' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-zinc-300">Resume Text</label>
                  <button onClick={() => setResumeText(SAMPLE_RESUME)} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    Try sample →
                  </button>
                </div>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here (copy-paste from your resume document)..."
                  className="input-field min-h-[180px] resize-none"
                />
              </div>
            )}

            {/* ── Job Description (both modes) ── */}
            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-300 mb-2 block">
                Job Description <span className="text-zinc-600 font-normal">(optional — for keyword matching)</span>
              </label>
              <textarea
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste the job description to get tailored keyword recommendations..."
                className="input-field min-h-[90px] resize-none"
              />
            </div>

            <button
              onClick={handleCheck}
              disabled={(mode === 'file' ? !resumeFile : !resumeText.trim()) || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading
                ? <><Spinner size="sm" /> Analyzing Resume...</>
                : <><ClipboardCheck className="w-4 h-4" /> Check ATS Score</>
              }
            </button>
          </div>

          <AffiliateCard type="resume" />

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Score Ring */}
                <div className="card text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={result.score >= 65 ? '#14b8a6' : result.score >= 50 ? '#eab308' : '#f87171'}
                        strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - result.score / 100)}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{result.score}</span>
                      <span className="text-xs text-zinc-500">/100</span>
                    </div>
                  </div>
                  <p className={`text-xl font-bold ${GRADE_COLORS[result.grade]}`}>{result.grade}</p>
                  <p className="text-xs text-zinc-500 mt-1">ATS Compatibility Score</p>
                  {result.extractedChars && (
                    <p className="text-xs text-zinc-600 mt-1">
                      <FileText className="w-3 h-3 inline mr-1" />
                      {result.extractedChars.toLocaleString()} characters extracted from file
                    </p>
                  )}
                </div>

                {/* Category Scores */}
                <div className="card">
                  <h3 className="text-sm font-semibold text-white mb-4">Category Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(result.categoryScores).map(([cat, data]) => (
                      <div key={cat}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-zinc-400 capitalize">{cat.replace(/([A-Z])/g,' $1')} Keywords</span>
                          <span className="text-xs font-mono text-brand-400">{data.score}/25</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.score/25)*100}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                          />
                        </div>
                        {data.found.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {data.found.slice(0,5).map(kw => (
                              <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/15">{kw}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Format Checks */}
                <div className="card">
                  <h3 className="text-sm font-semibold text-white mb-3">Format Checklist</h3>
                  <div className="space-y-2">
                    {result.formatChecks.map((check, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        {check.pass
                          ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                        <span className={`text-xs ${check.pass ? 'text-zinc-300' : 'text-zinc-500'}`}>{check.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* JD Keywords */}
                {result.jdMatch?.length > 0 && (
                  <div className="card">
                    <h3 className="text-sm font-semibold text-white mb-3">Job Description Match</h3>
                    <div className="mb-3">
                      <p className="text-xs text-zinc-500 mb-2">✅ Keywords found in your resume:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.jdMatch.map(w => <span key={w} className="text-[10px] px-2 py-0.5 rounded-lg bg-green-500/10 text-green-400">{w}</span>)}
                      </div>
                    </div>
                    {result.jdMissing?.length > 0 && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-2">❌ Keywords missing from your resume:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.jdMissing.map(w => <span key={w} className="text-[10px] px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400">{w}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions?.length > 0 && (
                  <div className="card">
                    <h3 className="text-sm font-semibold text-white mb-3">💡 Improvement Tips</h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                          <AlertCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <section className="card">
            <h2 className="text-lg font-bold text-white mb-3">What is an ATS Score?</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Most large companies use Applicant Tracking Systems (ATS) to filter resumes before a human ever sees them.
              An ATS score measures how well your resume is formatted and keyword-optimized for automated parsing.
              Our checker evaluates your resume across technical skills, soft skills, action verbs, formatting standards,
              and job-specific keyword match. Upload your PDF or Word doc directly — no copy-pasting needed.
            </p>
          </section>
        </div>
      </ToolPage>
    </>
  )
}
