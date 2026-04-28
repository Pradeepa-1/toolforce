import { motion } from 'framer-motion'
import AdSlot from '../ads/AdSlot'
import AffiliateCard from '../affiliate/AffiliateCard'

export default function ToolPage({ icon, title, description, badge, affiliateType, children }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        {badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-4">
            {badge}
          </span>
        )}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{background:'linear-gradient(135deg,rgba(20,184,166,0.2),rgba(139,92,246,0.2))'}}>
            {icon}
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">{description}</p>
      </motion.div>

      {/* In-content top ad */}
      <AdSlot type="in-content" label="In-Content Ad — 728×90" className="mb-8" />

      {/* Main content + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          {children}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {affiliateType && <AffiliateCard type={affiliateType} />}
          <AdSlot type="rectangle" label="Sidebar Ad — 300×250" />
        </motion.div>
      </div>

      {/* Bottom in-content ad */}
      <AdSlot type="in-content" label="Bottom In-Content Ad" className="mt-8" />
    </div>
  )
}
