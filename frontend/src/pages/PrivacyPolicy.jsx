import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import SEO from '../components/common/SEO'

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
    <div className="text-sm text-zinc-400 leading-relaxed space-y-3">{children}</div>
  </section>
)

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy — ToolForge"
        description="Read ToolForge's privacy policy. Learn how we handle your data, files, and personal information when you use our free online tools."
        keywords="toolforge privacy policy, data privacy, file security"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-7 h-7 text-teal-400" />
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-sm text-zinc-500 mb-10">Last updated: January 1, 2025</p>

          <div className="card mb-6 flex items-start gap-3">
            <span className="text-xl">🔒</span>
            <p className="text-sm text-zinc-300 leading-relaxed">
              <strong className="text-white">TL;DR:</strong> We don't sell your data. Files you upload are processed and automatically deleted within 1 hour. We use Google Analytics and Google AdSense, which set cookies. That's it.
            </p>
          </div>

          <Section title="1. Information We Collect">
            <p>ToolForge ("we," "us," or "our") collects minimal information to operate our services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-zinc-300">Uploaded Files:</strong> Files you upload to our tools are processed server-side and automatically deleted within 1 hour of processing. We do not retain, analyze, or share your file contents.</li>
              <li><strong className="text-zinc-300">Usage Data:</strong> We collect anonymous usage statistics (page views, tool usage frequency) via Google Analytics to understand how our tools are used and improve them.</li>
              <li><strong className="text-zinc-300">Contact Information:</strong> If you contact us via the contact form, we collect your name, email, and message to respond to you.</li>
              <li><strong className="text-zinc-300">Log Data:</strong> Our servers automatically record IP addresses, browser type, referring URLs, and access timestamps for security and performance monitoring.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1">
              <li>To process your files and deliver results</li>
              <li>To improve and optimize our tools and user experience</li>
              <li>To respond to your support requests and inquiries</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Cookies and Advertising">
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-zinc-300">Google AdSense:</strong> We display advertisements from Google AdSense. Google uses cookies to serve ads based on your prior visits to our website and other sites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-teal-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
              <li><strong className="text-zinc-300">Google Analytics:</strong> We use Google Analytics to understand how visitors interact with our site. Google Analytics sets cookies to report on user interactions. You can opt out via the <a href="https://tools.google.com/dlpage/gaoptout" className="text-teal-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</li>
              <li><strong className="text-zinc-300">Essential Cookies:</strong> Necessary for the website to function properly. These cannot be disabled.</li>
            </ul>
          </Section>

          <Section title="4. Affiliate Links">
            <p>Some pages on ToolForge contain affiliate links to third-party products and services. When you click these links and make a purchase, we may earn a commission at no additional cost to you. All affiliate relationships are disclosed with "Sponsored" labels. We only recommend products we genuinely believe in.</p>
          </Section>

          <Section title="5. Data Sharing">
            <p>We do not sell, trade, or otherwise transfer your personal information to outside parties, except:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>When required by law or legal process</li>
              <li>To protect the rights, property, or safety of ToolForge, our users, or the public</li>
              <li>With service providers who assist in operating our website (bound by confidentiality agreements)</li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <p>Uploaded files are automatically deleted from our servers within 1 hour of processing. Contact form submissions are retained for up to 12 months. Analytics data is retained per Google's standard retention policies. You may request deletion of any personal data by contacting us.</p>
          </Section>

          <Section title="7. Security">
            <p>We implement industry-standard security measures including HTTPS encryption, secure server configurations, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>ToolForge is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</p>
          </Section>

          <Section title="9. Your Rights">
            <p>Depending on your jurisdiction, you may have the right to: access your personal data, correct inaccurate data, request deletion of your data, object to processing, and data portability. To exercise these rights, contact us at privacy@toolforge.app.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify users of significant changes by posting the new policy on this page with an updated "Last updated" date. Continued use of our services after changes constitutes acceptance of the new policy.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>For privacy-related questions or requests, contact us at:<br />
              <strong className="text-zinc-300">Email:</strong> privacy@toolforge.app<br />
              <strong className="text-zinc-300">Address:</strong> ToolForge, [Your Address]
            </p>
          </Section>
        </motion.div>
      </div>
    </>
  )
}
