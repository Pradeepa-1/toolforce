import { ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'

// Affiliate Card — replace href values with actual affiliate tracked links
// Use UTM: ?utm_source=toolforge&utm_medium=affiliate&utm_campaign=TOOL_NAME

export const affiliateData = {
  resume:     { title: 'Resumegenius Pro — AI Resume Builder',   description: 'ATS-optimized templates used by 2M+ job seekers. Beat the bots and land more interviews.',   cta: 'Build Better Resume', href: '#affiliate-resumegenius', highlight: true,  stars: 4.9 },
  grammarly:  { title: 'Grammarly — Write With Confidence',      description: 'AI-powered grammar and style checker. Trusted by 30M+ writers worldwide.',                    cta: 'Try Grammarly Free',  href: '#affiliate-grammarly',  highlight: false, stars: 4.8 },
  canva:      { title: 'Canva Pro — Design Anything',            description: 'Create videos, graphics & presentations. 100M+ templates, brand kits, and team tools.',        cta: 'Try Canva Pro Free',  href: '#affiliate-canva',      highlight: true,  stars: 4.7 },
  imageTools: { title: 'Adobe Creative Cloud',                   description: 'Professional Photoshop, Illustrator, and 20+ apps. Industry-standard creative suite.',         cta: 'Start Free Trial',    href: '#affiliate-adobe',      highlight: false, stars: 4.8 },
  videoTools: { title: 'Canva Pro — Design & Video Suite',       description: 'Create stunning videos, reels and presentations with drag-and-drop simplicity.',               cta: 'Try Canva Pro Free',  href: '#affiliate-canva',      highlight: true,  stars: 4.7 },
  social:     { title: 'Buffer — Schedule Social Posts',         description: 'Auto-publish captions and hashtags to Instagram, TikTok, Twitter and more.',                  cta: 'Start Free Plan',     href: '#affiliate-buffer',     highlight: false, stars: 4.6 },
  general:    { title: 'Notion — All-in-One Workspace',          description: 'Docs, databases, and project management in one beautiful tool. Used by 30M+ people.',         cta: 'Get Notion Free',     href: '#affiliate-notion',     highlight: false, stars: 4.8 },
}

// Accepts either named props OR a `type` key to look up from affiliateData
export default function AffiliateCard({ type, title, description, cta = 'Try Now', href = '#', badge = 'Sponsored', stars = 4.8, highlight = false }) {
  // If type is provided, look up data from affiliateData map
  const data = type ? affiliateData[type] : null
  const t = data?.title       ?? title       ?? 'Recommended Tool'
  const d = data?.description ?? description ?? 'Check out this recommended tool.'
  const c = data?.cta         ?? cta
  const h = data?.href        ?? href
  const s = data?.stars       ?? stars
  const hi = data?.highlight  ?? highlight

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border transition-all duration-300 group ${hi ? 'border-teal-500/30 bg-gradient-to-br from-teal-900/20 to-violet-900/10' : 'bg-white/3 hover:bg-white/5'} ${!hi ? 'border-white/[0.08]' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400">{badge}</span>
            {hi && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">⭐ Top Pick</span>}
          </div>
          <h4 className="font-semibold text-white text-sm">{t}</h4>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-zinc-400">{s}</span>
        </div>
      </div>
      <p className="text-xs text-zinc-500 leading-relaxed mb-4">{d}</p>
      {/* Affiliate Link — replace href with actual tracked affiliate URL */}
      <a href={h} target="_blank" rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-all group-hover:gap-3">
        {c} <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
      </a>
    </motion.div>
  )
}
