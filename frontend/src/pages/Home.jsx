import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ImageDown, FileOutput, Eraser, Video, FileText, ClipboardCheck, MessageSquare, Hash, QrCode, Type, Palette, Quote, ArrowRight, Zap, Shield, Clock } from 'lucide-react'
import SEO from '../components/common/SEO'
import AdSlot from '../components/ads/AdSlot'
import AffiliateCard from '../components/affiliate/AffiliateCard'

const TOOLS = [
  { icon: <ImageDown className="w-6 h-6" />, name: 'Image Compressor', desc: 'Reduce image size by up to 90% without losing quality.', href: '/tools/image-compressor', color: 'from-cyan-500/20 to-teal-500/20', badge: 'Popular' },
  { icon: <FileOutput className="w-6 h-6" />, name: 'Image to PDF', desc: 'Convert multiple images into a single PDF document.', href: '/tools/image-to-pdf', color: 'from-blue-500/20 to-indigo-500/20' },
  { icon: <Eraser className="w-6 h-6" />, name: 'Background Remover', desc: 'Remove image backgrounds instantly with AI.', href: '/tools/background-remover', color: 'from-purple-500/20 to-pink-500/20', badge: 'AI' },
  { icon: <Video className="w-6 h-6" />, name: 'Video Compressor', desc: 'Compress videos for social media and web sharing.', href: '/tools/video-compressor', color: 'from-red-500/20 to-orange-500/20' },
  { icon: <FileText className="w-6 h-6" />, name: 'Text Summarizer', desc: 'Summarize long articles and documents in seconds.', href: '/tools/text-summarizer', color: 'from-green-500/20 to-emerald-500/20', badge: 'NLP' },
  { icon: <ClipboardCheck className="w-6 h-6" />, name: 'ATS Checker', desc: 'Score your resume for ATS compatibility and keywords.', href: '/tools/ats-checker', color: 'from-yellow-500/20 to-amber-500/20', badge: 'Hot' },
  { icon: <MessageSquare className="w-6 h-6" />, name: 'Caption Generator', desc: 'Generate engaging social media captions by topic.', href: '/tools/caption-generator', color: 'from-pink-500/20 to-rose-500/20' },
  { icon: <Hash className="w-6 h-6" />, name: 'Hashtag Generator', desc: 'Get strategic hashtag sets to maximize your reach.', href: '/tools/hashtag-generator', color: 'from-violet-500/20 to-purple-500/20' },
  { icon: <Quote className="w-6 h-6" />, name: 'Tamil Quote Generator', desc: 'Beautiful Tamil quotes with stylish image backgrounds.', href: '/tools/tamil-quote-generator', color: 'from-orange-500/20 to-red-500/20', badge: 'Tamil' },
  { icon: <QrCode className="w-6 h-6" />, name: 'QR Code Generator', desc: 'Create QR codes for URLs, WiFi, WhatsApp and more.', href: '/tools/qr-code-generator', color: 'from-teal-500/20 to-cyan-500/20', badge: 'New' },
  { icon: <Type className="w-6 h-6" />, name: 'Word Counter', desc: 'Count words, characters, sentences with keyword analysis.', href: '/tools/word-counter', color: 'from-indigo-500/20 to-blue-500/20', badge: 'New' },
  { icon: <Palette className="w-6 h-6" />, name: 'Color Palette Generator', desc: 'Generate beautiful color schemes — copy HEX, CSS vars.', href: '/tools/color-palette-generator', color: 'from-fuchsia-500/20 to-pink-500/20', badge: 'New' },
]

const BLOG_POSTS = [
  { title: 'How to Compress Images Without Losing Quality', slug: 'compress-images-without-losing-quality', date: 'Jan 15, 2025', readTime: '4 min' },
  { title: 'Best ATS Resume Tips to Get Past the Bots', slug: 'ats-resume-tips', date: 'Jan 10, 2025', readTime: '6 min' },
  { title: 'Complete Guide to Instagram Hashtag Strategy in 2025', slug: 'instagram-hashtag-strategy-2025', date: 'Jan 5, 2025', readTime: '8 min' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function Home() {
  return (
    <>
      <SEO
        title="ToolForge — Free Online Tools for Images, PDF, Text & Social Media"
        description="Free online tools for image compression, PDF conversion, text summarization, resume ATS checking, caption generation, and more. No signup required."
        keywords="free online tools, image compressor, pdf converter, text summarizer, ats resume checker, caption generator, hashtag generator"
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{background:'radial-gradient(circle, #14b8a6, transparent)'}} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{background:'radial-gradient(circle, #8b5cf6, transparent)'}} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium glass border border-white/10">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              12 Free Tools — No Signup Required
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            All-in-One
            <br />
            <span className="gradient-text">Online Tools</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Compress images, convert PDFs, check ATS scores, generate captions and more.
            Powerful tools that just work — completely free, forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/tools/image-compressor" className="btn-primary flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Try Image Compressor
            </Link>
            <Link to="/tools/ats-checker" className="btn-secondary flex items-center justify-center gap-2">
              Check ATS Score <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-8 mt-14 text-center"
          >
            {[['12+', 'Free Tools'], ['100%', 'Free Forever'], ['No', 'Signup Needed']].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold gradient-text">{val}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="section-title text-white mb-3">All Free Tools</h2>
          <p className="text-zinc-500 text-sm">12 powerful tools — pick one and start creating, no account needed</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {TOOLS.map((tool) => (
            <motion.div key={tool.href} variants={item}>
              <Link
                to={tool.href}
                className="card glass-hover group block h-full"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {tool.icon}
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-white text-sm leading-tight">{tool.name}</h3>
                  {tool.badge && (
                    <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-brand-500/20 text-brand-400 border border-brand-500/20">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">{tool.desc}</p>
                <span className="text-xs text-brand-400 group-hover:text-brand-300 flex items-center gap-1 transition-colors">
                  Use tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* In-content ad */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <AdSlot type="in-content" label="In-Content Ad — 728×90" />
      </div>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="section-title text-white mb-3">Why Choose ToolForge?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="w-6 h-6 text-brand-400" />, title: 'Lightning Fast', desc: 'Server-side processing with optimized libraries. Most tasks complete in under 3 seconds.' },
            { icon: <Shield className="w-6 h-6 text-brand-400" />, title: 'Private & Secure', desc: 'Files are processed and automatically deleted within 1 hour. We never store or share your data.' },
            { icon: <Clock className="w-6 h-6 text-brand-400" />, title: 'Always Free', desc: 'Core tools are free forever. No credit card, no trial period, no hidden limits.' },
          ].map(f => (
            <div key={f.title} className="card text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AffiliateCard type="resume" />
          <AffiliateCard type="grammarly" />
          <AffiliateCard type="canva" />
        </div>
      </section>

      {/* Blog preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Latest from Blog</h2>
          <Link to="/blog" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="card glass-hover group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-zinc-600">{post.date}</span>
                <span className="text-zinc-700">·</span>
                <span className="text-xs text-zinc-600">{post.readTime} read</span>
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors leading-snug">{post.title}</h3>
              <span className="mt-3 text-xs text-brand-400 flex items-center gap-1">
                Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
