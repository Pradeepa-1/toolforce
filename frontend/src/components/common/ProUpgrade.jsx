import { Lock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

// Premium / Pro upgrade UI component
// integrate payment system here (Stripe, Paddle, Lemon Squeezy, etc.)
// Suggested: https://stripe.com/docs or https://www.lemonsqueezy.com

export default function ProUpgrade({ feature = 'This feature', children }) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blurred content behind */}
      <div className="blur-sm pointer-events-none select-none opacity-60">
        {children}
      </div>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
        style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(4px)' }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#14b8a6,#8b5cf6)' }}>
          <Lock className="w-5 h-5 text-white" />
        </div>
        <div className="text-center px-6">
          <h3 className="font-bold text-white text-lg mb-1">{feature} is Pro Only</h3>
          <p className="text-zinc-400 text-sm">Unlock unlimited usage, higher limits, and priority processing.</p>
        </div>
        <button
          onClick={() => {
            // integrate payment system here
            alert('Payment integration coming soon! Connect Stripe or Paddle here.')
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Upgrade to Pro — $9/mo
        </button>
        <p className="text-xs text-zinc-600">Cancel anytime. 7-day free trial included.</p>
      </motion.div>
    </div>
  )
}

// Pro feature badge for cards
export function ProBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ background: 'linear-gradient(135deg,rgba(20,184,166,0.2),rgba(139,92,246,0.2))', border: '1px solid rgba(20,184,166,0.3)', color: '#5eead4' }}>
      <Zap className="w-2.5 h-2.5" /> Pro
    </span>
  )
}
