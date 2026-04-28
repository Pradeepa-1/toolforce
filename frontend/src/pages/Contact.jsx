import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import SEO from '../components/common/SEO'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      return toast.error('Please fill in all required fields')
    }
    setLoading(true)
    try {
      const { data } = await axios.post('/api/contact', form)
      if (data.success) {
        setLoading(false)
        setSent(true)
        toast.success('Message sent! Check your inbox for confirmation.')
      }
    } catch (err) {
      setLoading(false)
      const msg = err.response?.data?.message || 'Failed to send. Please try again.'
      toast.error(msg)
    }
  }

  return (
    <>
      <SEO
        title="Contact ToolForge — Get in Touch"
        description="Have a question, feedback, or want to report a bug? Get in touch with the ToolForge team. We typically respond within 24 hours."
        keywords="contact toolforge, support, feedback, bug report"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg,rgba(20,184,166,0.2),rgba(139,92,246,0.2))' }}>
            <MessageSquare className="w-7 h-7 text-teal-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Get in Touch</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Questions, feedback, partnership inquiries, or bug reports — we read every message and respond within 24 hours.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <a href="mailto:hello@toolforge.app" className="card glass-hover text-center group">
            <Mail className="w-6 h-6 text-teal-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-white mb-1">Email Us</p>
            <p className="text-xs text-zinc-500">hello@toolforge.app</p>
          </a>
          <div className="card text-center">
            <MessageSquare className="w-6 h-6 text-violet-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-white mb-1">Response Time</p>
            <p className="text-xs text-zinc-500">Within 24 hours</p>
          </div>
        </div>

        {/* Form */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-12"
          >
            <CheckCircle className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Message Received!</h2>
            <p className="text-sm text-zinc-400">We'll get back to you at <strong className="text-white">{form.email}</strong> within 24 hours.</p>
            <button onClick={() => { setSent(false); setForm({ name:'',email:'',subject:'',message:'' }) }}
              className="btn-secondary mt-6 text-sm">Send Another</button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="card space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Name *</label>
                <input
                  className="input-field"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email *</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Subject</label>
              <select
                className="input-field"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              >
                <option value="">Select a topic</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="partnership">Partnership / Affiliate</option>
                <option value="feedback">General Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Message *</label>
              <textarea
                className="input-field resize-none"
                rows={5}
                placeholder="Tell us what's on your mind..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <><Send className="w-4 h-4" /> Send Message</>
              )}
            </button>
            <p className="text-center text-xs text-zinc-600">We never share your information with third parties.</p>
          </motion.form>
        )}
      </div>
    </>
  )
}
