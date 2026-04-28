import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, ChevronDown, ImageDown, FileOutput, Eraser, Video, FileText, ClipboardCheck, MessageSquare, Hash, Quote, QrCode, Type, Palette } from 'lucide-react'

const TOOLS = [
  { icon: <ImageDown className="w-3.5 h-3.5" />,    name: 'Image Compressor',      href: '/tools/image-compressor',       badge: 'Popular' },
  { icon: <FileOutput className="w-3.5 h-3.5" />,   name: 'Image to PDF',           href: '/tools/image-to-pdf' },
  { icon: <Eraser className="w-3.5 h-3.5" />,       name: 'Background Remover',    href: '/tools/background-remover',     badge: 'AI' },
  { icon: <Video className="w-3.5 h-3.5" />,        name: 'Video Compressor',      href: '/tools/video-compressor' },
  { icon: <FileText className="w-3.5 h-3.5" />,     name: 'Text Summarizer',       href: '/tools/text-summarizer' },
  { icon: <ClipboardCheck className="w-3.5 h-3.5" />, name: 'ATS Checker',         href: '/tools/ats-checker',            badge: 'Hot' },
  { icon: <MessageSquare className="w-3.5 h-3.5" />, name: 'Caption Generator',    href: '/tools/caption-generator' },
  { icon: <Hash className="w-3.5 h-3.5" />,         name: 'Hashtag Generator',     href: '/tools/hashtag-generator' },
  { icon: <Quote className="w-3.5 h-3.5" />,        name: 'Tamil Quote Generator', href: '/tools/tamil-quote-generator',  badge: 'Tamil' },
  { icon: <QrCode className="w-3.5 h-3.5" />,       name: 'QR Code Generator',     href: '/tools/qr-code-generator',     badge: 'New' },
  { icon: <Type className="w-3.5 h-3.5" />,         name: 'Word Counter',          href: '/tools/word-counter',           badge: 'New' },
  { icon: <Palette className="w-3.5 h-3.5" />,      name: 'Color Palette',         href: '/tools/color-palette-generator',badge: 'New' },
]

const BADGE_COLORS = {
  Popular: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  AI:      'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Hot:     'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Tamil:   'text-red-400 bg-red-500/10 border-red-500/20',
  New:     'text-teal-400 bg-teal-500/10 border-teal-500/20',
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const dropdownRef = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setToolsOpen(false)
  }, [location])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-xl' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo — same icon as favicon */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{background:'linear-gradient(135deg,#14b8a6,#8b5cf6)'}}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Tool<span className="gradient-text">Forge</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">

          {/* Tools Dropdown */}
          <div className="relative" ref={dropdownRef}
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}>
            <button className="flex items-center gap-1 hover:text-white transition-colors py-2">
              Tools <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 w-64 glass rounded-2xl py-2 shadow-2xl mt-1 border border-white/[0.08]"
                >
                  {TOOLS.map(t => (
                    <Link
                      key={t.href}
                      to={t.href}
                      className="flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <span className="w-6 h-6 rounded-lg bg-white/[0.05] group-hover:bg-white/[0.08] flex items-center justify-center flex-shrink-0 text-zinc-400 group-hover:text-white transition-colors">
                        {t.icon}
                      </span>
                      <span className="flex-1 leading-tight">{t.name}</span>
                      {t.badge && (
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border ${BADGE_COLORS[t.badge] || 'text-zinc-400 bg-white/5 border-white/10'}`}>
                          {t.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="mx-3 mt-1 mb-1 pt-2 border-t border-white/[0.06]">
                    <Link to="/" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-teal-400 transition-colors py-1">
                      <Zap className="w-3 h-3" /> View all 12 tools →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link to="/tools/ats-checker" className="btn-primary !py-2 !px-4 text-xs">
            ✦ Upgrade to Pro
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-xl glass" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-1">Tools</p>
              {TOOLS.map(t => (
                <Link key={t.href} to={t.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                  <span className="w-5 h-5 flex items-center justify-center text-zinc-500">{t.icon}</span>
                  <span className="flex-1">{t.name}</span>
                  {t.badge && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border ${BADGE_COLORS[t.badge] || 'text-zinc-400 bg-white/5 border-white/10'}`}>
                      {t.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-2" />
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-1">Pages</p>
              <Link to="/blog" className="block px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">Blog</Link>
              <Link to="/about" className="block px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">About</Link>
              <Link to="/contact" className="block px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">Contact</Link>
              <Link to="/tools/ats-checker" className="btn-primary text-center mt-2">✦ Upgrade to Pro</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
