import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://toolforge.app'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

export default function SEO({
  title, description, keywords, canonical,
  ogImage, toolName, toolDescription,
}) {
  const siteName = 'ToolForge'
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Free Online Tools`
  const defaultDesc = 'Free online tools for images, video, PDF, text, and social media. No signup required. Fast, secure, and always free.'
  const defaultKeywords = 'free online tools, image compressor, video compressor, pdf converter, background remover, text summarizer'
  const metaDesc = description || defaultDesc
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined

  const toolSchema = toolName ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolName,
    description: toolDescription || metaDesc,
    url: canonicalUrl || SITE_URL,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: siteName, url: SITE_URL },
  }) : null

  const breadcrumbSchema = canonical ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: toolName || title, item: canonicalUrl },
    ],
  }) : null

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <meta name="author" content={siteName} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage || DEFAULT_OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage || DEFAULT_OG_IMAGE} />
      {toolSchema && <script type="application/ld+json">{toolSchema}</script>}
      {breadcrumbSchema && <script type="application/ld+json">{breadcrumbSchema}</script>}
    </Helmet>
  )
}
