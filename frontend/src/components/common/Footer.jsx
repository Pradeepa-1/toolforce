import { Link } from 'react-router-dom'
import { Zap, Twitter, Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#14b8a6,#8b5cf6)'}}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Tool<span className="gradient-text">Forge</span></span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed mb-4">
              Free, fast, and powerful online tools for everyone. No signup required.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 glass rounded-xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Tools col 1 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Tools</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              {[
                ['Image Compressor', '/tools/image-compressor'],
                ['Image to PDF', '/tools/image-to-pdf'],
                ['Background Remover', '/tools/background-remover'],
                ['Video Compressor', '/tools/video-compressor'],
                ['Text Summarizer', '/tools/text-summarizer'],
                ['ATS Checker', '/tools/ats-checker'],
              ].map(([n, h]) => (
                <li key={h}><Link to={h} className="hover:text-white transition-colors">{n}</Link></li>
              ))}
            </ul>
          </div>

          {/* Tools col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">More Tools</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              {[
                ['Caption Generator', '/tools/caption-generator'],
                ['Hashtag Generator', '/tools/hashtag-generator'],
                ['Tamil Quote Generator', '/tools/tamil-quote-generator'],
                ['QR Code Generator', '/tools/qr-code-generator'],
                ['Word Counter', '/tools/word-counter'],
                ['Color Palette', '/tools/color-palette-generator'],
              ].map(([n, h]) => (
                <li key={h}><Link to={h} className="hover:text-white transition-colors">{n}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              {[
                ['About', '/about'],
                ['Blog', '/blog'],
                ['Contact', '/contact'],
                ['Privacy Policy', '/privacy-policy'],
                ['Terms & Conditions', '/terms'],
              ].map(([n, h]) => (
                <li key={h}><Link to={h} className="hover:text-white transition-colors">{n}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} ToolForge. All rights reserved.</p>
          <p className="text-xs text-zinc-700">Built with ❤️ for creators, students, and professionals worldwide.</p>
        </div>
      </div>
    </footer>
  )
}
