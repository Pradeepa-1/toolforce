import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, BookOpen } from 'lucide-react'
import SEO from '../components/common/SEO'
import AdSlot from '../components/ads/AdSlot'

export const BLOG_POSTS = [
  {
    slug: 'compress-images-without-losing-quality',
    title: 'How to Compress Images Without Losing Quality in 2025',
    excerpt: 'Learn the science behind image compression and how to reduce file sizes by up to 90% while keeping your visuals sharp and professional.',
    date: 'January 15, 2025',
    readTime: '4 min',
    category: 'Image Tools',
    tags: ['compression', 'jpeg', 'webp', 'optimization'],
  },
  {
    slug: 'ats-resume-tips',
    title: 'Best ATS Resume Tips to Get Past the Bots in 2025',
    excerpt: 'Over 75% of resumes are rejected by ATS before a human ever sees them. Here\'s exactly how to write a resume that beats the bots and lands interviews.',
    date: 'January 10, 2025',
    readTime: '6 min',
    category: 'Career',
    tags: ['resume', 'ats', 'job search', 'career'],
  },
  {
    slug: 'instagram-hashtag-strategy-2025',
    title: 'Complete Guide to Instagram Hashtag Strategy in 2025',
    excerpt: 'Hashtags still work in 2025 — but the strategy has evolved. Discover exactly how many to use, which types to mix, and how to find your winning combination.',
    date: 'January 5, 2025',
    readTime: '8 min',
    category: 'Social Media',
    tags: ['instagram', 'hashtags', 'social media', 'growth'],
  },
  {
    slug: 'image-to-pdf-guide',
    title: 'The Complete Guide to Converting Images to PDF Online',
    excerpt: 'Whether you\'re creating a portfolio, report, or sharing photos securely, converting images to PDF is a skill everyone needs. Here\'s the complete guide.',
    date: 'December 28, 2024',
    readTime: '5 min',
    category: 'PDF Tools',
    tags: ['pdf', 'conversion', 'images', 'documents'],
  },
  {
    slug: 'text-summarization-guide',
    title: 'How AI Text Summarization Works (And Why It\'s Not Magic)',
    excerpt: 'Text summarization tools have become essential for researchers, students, and professionals. Here\'s how they actually work and how to get the best results.',
    date: 'December 20, 2024',
    readTime: '7 min',
    category: 'AI Tools',
    tags: ['ai', 'nlp', 'text', 'summarization'],
  },
  {
    slug: 'social-media-caption-writing',
    title: '10 Caption Writing Formulas That Drive Engagement in 2025',
    excerpt: 'Great captions turn scrollers into followers and followers into customers. Here are 10 battle-tested caption formulas with real examples you can steal today.',
    date: 'December 15, 2024',
    readTime: '5 min',
    category: 'Social Media',
    tags: ['captions', 'instagram', 'copywriting', 'engagement'],
  },
]

const categoryColors = {
  'Image Tools': 'bg-cyan-500/15 text-cyan-400',
  'Career': 'bg-yellow-500/15 text-yellow-400',
  'Social Media': 'bg-pink-500/15 text-pink-400',
  'PDF Tools': 'bg-blue-500/15 text-blue-400',
  'AI Tools': 'bg-violet-500/15 text-violet-400',
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function Blog() {
  return (
    <>
      <SEO
        title="Blog — ToolForge Tips, Guides & Tutorials"
        description="Learn how to compress images, optimize resumes, grow on social media, and more. Expert guides and tutorials from the ToolForge team."
        keywords="image compression guide, ats resume tips, hashtag strategy, pdf conversion, text summarization"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg,rgba(20,184,166,0.2),rgba(139,92,246,0.2))' }}>
            <BookOpen className="w-7 h-7 text-teal-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Guides & <span className="gradient-text">Tutorials</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Expert tips on image optimization, resume writing, social media growth, and getting the most out of ToolForge's free tools.
          </p>
        </motion.div>

        <AdSlot type="in-content" label="Blog Top Ad — 728×90" className="mb-10" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {BLOG_POSTS.map(post => (
            <motion.div key={post.slug} variants={item}>
              <Link to={`/blog/${post.slug}`} className="card glass-hover group h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-zinc-700 text-zinc-400'}`}>
                    {post.category}
                  </span>
                  <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{post.readTime} read
                  </span>
                </div>
                <h2 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:text-teal-400 transition-colors flex-1">
                  {post.title}
                </h2>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-zinc-600">{post.date}</span>
                  <span className="text-xs text-teal-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <AdSlot type="in-content" label="Blog Bottom Ad" className="mt-12" />
      </div>
    </>
  )
}
