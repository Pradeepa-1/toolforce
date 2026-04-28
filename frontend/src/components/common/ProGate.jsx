import { Lock, Zap, Check } from 'lucide-react'
import { motion } from 'framer-motion'

// Premium Gate UI — integrate payment system here
// TODO: Connect to Stripe / Paddle / LemonSqueezy

const PRO_FEATURES = [
  'Unlimited file size (up to 500MB)',
  'Batch processing (up to 50 files)',
  'Priority processing queue',
  'No watermarks',
  'API access',
  'Advanced settings',
]

export default function ProGate({ feature = 'this feature', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${className}`}
      style={{
        borderColor: 'rgba(139,92,246,0.3)',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(20,184,166,0.06))',
      }}
    >
      <div className="p-6 text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: 'rgba(139,92,246,0.2)' }}
        >
          <Lock className="w-5 h-5" style={{ color: '#a78bfa' }} />
        </div>

        <h3 className="font-bold text-white text-base mb-1">Unlock {feature}</h3>
        <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
          Upgrade to Pro for unlimited access, priority processing, and advanced features.
        </p>

        <ul className="text-left space-y-2 mb-6 max-w-xs mx-auto">
          {PRO_FEATURES.map(f => (
            <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#14b8a6' }} />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* integrate payment system here */}
          <button
            className="btn-primary flex items-center gap-2 justify-center"
            onClick={() => alert('Payment integration coming soon!')}
          >
            <Zap className="w-4 h-4" />
            Upgrade to Pro — $9/mo
          </button>
          <button className="btn-secondary text-sm">Try Free for 7 Days</button>
        </div>
        <p className="text-[10px] text-zinc-600 mt-3">Cancel anytime. No questions asked.</p>
      </div>
    </motion.div>
  )
}

export function ProBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{
        background: 'linear-gradient(135deg,rgba(20,184,166,0.2),rgba(139,92,246,0.2))',
        border: '1px solid rgba(20,184,166,0.3)',
        color: '#5eead4',
      }}
    >
      <Zap className="w-2.5 h-2.5" /> PRO
    </span>
  )
}
