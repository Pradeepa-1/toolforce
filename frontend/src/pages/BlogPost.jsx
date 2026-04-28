import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import SEO from '../components/common/SEO'
import AdSlot from '../components/ads/AdSlot'
import AffiliateCard from '../components/affiliate/AffiliateCard'
import { BLOG_POSTS } from './Blog'

// Static blog content
const BLOG_CONTENT = {
  'compress-images-without-losing-quality': {
    intro: `Image compression is one of the most misunderstood topics in web development and digital media. Many people believe that compression always means quality loss — but that's only half the story. The truth is that intelligent compression can reduce file sizes by 70–90% while maintaining virtually identical visual quality to the human eye.`,
    sections: [
      {
        heading: 'Understanding Lossy vs Lossless Compression',
        content: `There are two fundamental types of image compression: lossy and lossless.\n\nLossy compression (used by JPEG and WebP) permanently removes some image data. The key is that it removes data the human visual system is least sensitive to — like subtle color variations in uniform areas. At quality settings of 70–80%, most people can't tell the difference from the original.\n\nLossless compression (used by PNG and GIF) preserves all image data but achieves smaller sizes by finding repetitive patterns. A solid-color background, for example, can be described as "10,000 blue pixels" rather than storing each pixel individually.`,
      },
      {
        heading: 'The Best Format for Every Use Case',
        content: `• JPEG: Best for photographs and images with complex color gradients. Use quality 70–85% for web.\n• WebP: Google's modern format that's 25–35% smaller than JPEG at the same quality. Use whenever supported.\n• PNG: Use for images requiring transparency, logos, screenshots, and images with text.\n• AVIF: The newest format with incredible compression — up to 50% smaller than JPEG. Limited but growing browser support.`,
      },
      {
        heading: 'Step-by-Step: How to Compress Images Without Quality Loss',
        content: `1. Start with the highest quality original you have\n2. Choose the right format (JPEG for photos, PNG for transparency)\n3. Set quality between 70–80% for JPEG/WebP — this is the sweet spot\n4. Use our free Image Compressor to process your images instantly\n5. Compare original and compressed side-by-side before publishing\n6. For web images, aim for under 200KB per image for optimal page speed`,
      },
      {
        heading: 'Why Image Compression Matters for SEO',
        content: `Google's Core Web Vitals include Largest Contentful Paint (LCP) — how fast your main image loads. Large, unoptimized images are one of the biggest causes of poor LCP scores. Sites that load in under 3 seconds see 32% lower bounce rates. Properly compressed images can directly improve your search rankings by improving page speed scores.`,
      },
    ],
    conclusion: `Image compression isn't about sacrificing quality — it's about being smart with data. With modern tools and formats like WebP, you can deliver stunning visuals that load lightning fast. Start with our free Image Compressor and see the difference for yourself.`,
    cta: { text: 'Compress Your Images Now — Free', href: '/tools/image-compressor' },
    affiliate: 'imageTools',
  },
  'ats-resume-tips': {
    intro: `Applicant Tracking Systems (ATS) scan your resume before any human sees it. According to Jobscan, over 98% of Fortune 500 companies use ATS software, and studies show that 75% of resumes are rejected before reaching a recruiter. The good news: once you understand how ATS works, beating it is straightforward.`,
    sections: [
      {
        heading: 'How ATS Software Actually Works',
        content: `ATS software parses your resume into structured data: contact info, work history, education, and skills. It then scores your resume based on keyword matches with the job description. The more relevant keywords you include, the higher your score — and the better your chances of reaching a human reviewer.`,
      },
      {
        heading: '7 ATS Optimization Tips That Actually Work',
        content: `1. Use the exact keywords from the job description — copy-paste job title, skills, and requirements\n2. Use standard section headers: "Work Experience," "Education," "Skills" (not creative alternatives)\n3. Avoid tables, columns, headers, footers, and text boxes — ATS can't read them\n4. Use a .docx or plain text format — PDFs can cause parsing errors in some ATS systems\n5. Include metrics and achievements: "Increased revenue by 40%" beats "Improved sales"\n6. List both spelled-out and abbreviated versions: "Search Engine Optimization (SEO)"\n7. Keep formatting simple: avoid fancy fonts, colors, and graphics`,
      },
      {
        heading: 'The Keyword Strategy That Gets Interviews',
        content: `Read the job description carefully and identify: required skills, preferred qualifications, industry-specific terms, and action verbs. Mirror these exact phrases in your resume. If the job says "cross-functional collaboration," don't write "worked across departments" — write "cross-functional collaboration."\n\nUse our free ATS Checker to score your resume against any job description and see exactly which keywords are missing.`,
      },
      {
        heading: 'What ATS Doesn\'t Evaluate',
        content: `ATS doesn't evaluate design, creativity, or your soft skills directly. It's purely looking for keyword density and structure. This means a plain, well-structured resume with the right keywords will beat a beautifully designed resume with wrong keywords every time — at least until a human sees it.`,
      },
    ],
    conclusion: `The secret to passing ATS isn't gaming the system — it's genuinely aligning your experience with what the employer needs, and expressing it in language the software understands. Paste your resume into our free ATS Checker to get your score and specific improvement recommendations.`,
    cta: { text: 'Check Your ATS Score Free', href: '/tools/ats-checker' },
    affiliate: 'resume',
  },
  'instagram-hashtag-strategy-2025': {
    intro: `Instagram hashtags in 2025 are nothing like they were in 2020. The algorithm has evolved, content discovery has changed, and the spray-and-pray approach of using 30 random popular hashtags is not only ineffective — it can actually hurt your reach. Here's the definitive guide to hashtag strategy that works today.`,
    sections: [
      {
        heading: 'How Many Hashtags Should You Use in 2025?',
        content: `Instagram's own creators team has recommended 3–5 highly relevant hashtags over the old 30-hashtag approach. Internal testing by social media researchers consistently shows that 5–10 targeted hashtags outperform 30 generic ones. Quality beats quantity — every time.`,
      },
      {
        heading: 'The 3-Tier Hashtag Framework',
        content: `The most effective hashtag strategy uses three tiers:\n\n1. High-reach (1M+ posts): #photography, #food, #travel — massive audience but extreme competition\n2. Mid-range (100K–1M posts): #foodphotographylovers, #travelblogger — better chance of appearing in top posts\n3. Niche (under 100K posts): #veganlondon, #minimalistphotography — highly engaged, very discoverable\n\nA 1:3:6 ratio (1 high, 3 mid, 6 niche) consistently delivers the best reach-to-engagement balance.`,
      },
      {
        heading: 'How to Find Your Best Hashtags',
        content: `1. Search your main topic hashtag and check the "Related" tags Instagram shows\n2. Look at what hashtags top performers in your niche use (not celebrities)\n3. Check which hashtags your engaged followers follow\n4. Use our free Hashtag Generator to get a pre-categorized set in seconds\n5. Test different sets over 2 weeks and track which drives more profile visits`,
      },
      {
        heading: 'Hashtags to Avoid in 2025',
        content: `Banned hashtags (like #beautyblogger, at various times) can suppress all your posts — not just the one using the bad tag. Overly generic hashtags (#love, #instagood) bury your content instantly. Repetitive hashtag sets used on every post train the algorithm to ignore them.`,
      },
    ],
    conclusion: `Hashtags are still a powerful discovery tool on Instagram in 2025 — but they require strategy, not volume. Start with our free Hashtag Generator to get a customized set for your niche, then test and refine over time.`,
    cta: { text: 'Generate Hashtags Free', href: '/tools/hashtag-generator' },
    affiliate: 'social',
  },
}

// Default content for other slugs
const defaultContent = (post) => ({
  intro: `${post.excerpt} In this comprehensive guide, we'll walk you through everything you need to know — with practical tips you can implement today.`,
  sections: [
    { heading: 'Why This Matters', content: `Understanding this topic can save you hours of time and significantly improve your results. Whether you're a beginner or experienced professional, the principles in this guide apply to everyone.` },
    { heading: 'The Core Principles', content: `The fundamentals haven't changed — what's changed is how we apply them. Focus on quality over quantity, use the right tools for the job, and always measure your results.` },
    { heading: 'Practical Tips You Can Use Today', content: `1. Start with the basics and build from there\n2. Use free tools (like ToolForge) to maximize results without spending money\n3. Track your results and iterate based on data\n4. Learn from examples in your industry` },
  ],
  conclusion: `Implementing these strategies will put you ahead of the 90% of people who never optimize their workflow. Start with one tool, see the results, and build from there.`,
  cta: { text: 'Try ToolForge Free Tools', href: '/' },
  affiliate: 'general',
})

export default function BlogPost() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find(p => p.slug === slug)

  if (!post) return <Navigate to="/blog" replace />

  const content = BLOG_CONTENT[slug] || defaultContent(post)

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={post.tags?.join(', ')}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Back link */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-teal-500/15 text-teal-400">
                  {post.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime} read</span>
              </div>
            </header>

            <AdSlot type="in-content" label="Article Top Ad" className="mb-8" />

            {/* Content */}
            <div className="prose-custom space-y-6">
              {/* Intro */}
              <div className="card border-l-4 border-l-teal-500/50">
                <p className="text-zinc-300 leading-relaxed text-sm">{content.intro}</p>
              </div>

              {/* Sections */}
              {content.sections.map((section, i) => (
                <section key={i} className="space-y-3">
                  <h2 className="text-lg font-bold text-white">{section.heading}</h2>
                  <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{section.content}</div>
                  {i === 1 && <AdSlot type="in-content" label="Mid-Article Ad" className="my-6" />}
                </section>
              ))}

              {/* Conclusion */}
              <div className="card">
                <h2 className="text-lg font-bold text-white mb-3">Conclusion</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">{content.conclusion}</p>
              </div>

              {/* CTA */}
              <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg,rgba(20,184,166,0.15),rgba(139,92,246,0.15))', border: '1px solid rgba(20,184,166,0.2)' }}>
                <p className="text-sm font-semibold text-white mb-3">{content.cta.text}</p>
                <Link to={content.cta.href} className="btn-primary inline-block">Try It Free →</Link>
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  <Tag className="w-4 h-4 text-zinc-600" />
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-zinc-500">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <AffiliateCard type={content.affiliate} />
            <AdSlot type="rectangle" label="Sidebar Ad — 300×250" />

            {/* Related posts */}
            <div className="card">
              <h3 className="text-sm font-bold text-white mb-4">Related Articles</h3>
              <div className="space-y-3">
                {BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3).map(p => (
                  <Link key={p.slug} to={`/blog/${p.slug}`}
                    className="block text-xs text-zinc-500 hover:text-white transition-colors leading-snug">
                    → {p.title}
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </>
  )
}
