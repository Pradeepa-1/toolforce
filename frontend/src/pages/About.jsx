import { motion } from 'framer-motion'
import { Zap, Target, Shield, Heart, Users, Globe } from 'lucide-react'
import SEO from '../components/common/SEO'
import AdSlot from '../components/ads/AdSlot'

const values = [
  { icon: <Zap className="w-5 h-5 text-teal-400" />, title: 'Speed First', desc: 'Every tool is optimized to process your files in seconds, not minutes.' },
  { icon: <Shield className="w-5 h-5 text-teal-400" />, title: 'Privacy by Design', desc: 'Files are auto-deleted after processing. We never store, share, or analyze your data.' },
  { icon: <Heart className="w-5 h-5 text-teal-400" />, title: 'Always Free', desc: 'Core tools are free forever. We sustain ourselves through non-intrusive ads and affiliates.' },
  { icon: <Globe className="w-5 h-5 text-teal-400" />, title: 'Accessible to All', desc: 'Designed for students, creators, freelancers, and businesses across every corner of the world.' },
]

const stats = [
  { value: '8+', label: 'Free Tools' },
  { value: '0', label: 'Signups Required' },
  { value: '100%', label: 'Browser-Based' },
  { value: '1hr', label: 'File Retention' },
]

export default function About() {
  return (
    <>
      <SEO
        title="About ToolForge — Our Mission & Story"
        description="Learn about ToolForge, our mission to provide free, fast, and privacy-first online tools for creators, students, and professionals worldwide."
        keywords="about toolforge, free online tools, our mission, privacy-first tools"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg,#14b8a6,#8b5cf6)' }}>
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            We Build Tools <span className="gradient-text">People Love</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
            ToolForge was born from a simple frustration: why do the best online tools require accounts, subscriptions, and endless friction? We set out to build something different.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card text-center"
            >
              <p className="text-3xl font-bold gradient-text mb-1">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <AdSlot type="in-content" label="In-Content Ad" className="mb-16" />

        {/* Story */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="card mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white">Our Story</h2>
          </div>
          <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
            <p>
              ToolForge started in early 2024 when our founder spent an entire afternoon trying to compress images for a freelance project. Every tool he tried required an account, had usage limits, or was cluttered with ads that broke the workflow.
            </p>
            <p>
              The solution was obvious: build a suite of genuinely useful tools that put the user first. No dark patterns. No paywall traps. No selling your data. Just clean, fast, powerful tools that work.
            </p>
            <p>
              Today, ToolForge serves students compressing screenshots for assignments, professionals converting images to PDF for reports, social media creators generating captions and hashtags, and job seekers optimizing resumes to beat ATS systems. We're proud of each one.
            </p>
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-6">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{v.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="card text-center"
        >
          <Users className="w-8 h-8 text-teal-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-3">Built by Indie Developers</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl mx-auto">
            ToolForge is an independent project built by a small team of developers who believe great software should be accessible to everyone. We're not backed by venture capital — we're sustained by our community and transparent monetization.
          </p>
          <p className="text-xs text-zinc-600 mt-4">
            We display non-intrusive ads and recommend affiliate products we genuinely believe in. That's how we keep the lights on — honestly.
          </p>
        </motion.section>
      </div>
    </>
  )
}
