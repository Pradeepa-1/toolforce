import { Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import ImageCompressor from './pages/tools/ImageCompressor'
import ImageToPdf from './pages/tools/ImageToPdf'
import BackgroundRemover from './pages/tools/BackgroundRemover'
import VideoCompressor from './pages/tools/VideoCompressor'
import TextSummarizer from './pages/tools/TextSummarizer'
import ATSChecker from './pages/tools/ATSChecker'
import CaptionGenerator from './pages/tools/CaptionGenerator'
import HashtagGenerator from './pages/tools/HashtagGenerator'
import TamilQuoteGenerator from './pages/tools/TamilQuoteGenerator'
import QRCodeGenerator from './pages/tools/QRCodeGenerator'
import WordCounter from './pages/tools/WordCounter'
import ColorPaletteGenerator from './pages/tools/ColorPaletteGenerator'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/tools/image-compressor" element={<ImageCompressor />} />
        <Route path="/tools/image-to-pdf" element={<ImageToPdf />} />
        <Route path="/tools/background-remover" element={<BackgroundRemover />} />
        <Route path="/tools/video-compressor" element={<VideoCompressor />} />
        <Route path="/tools/text-summarizer" element={<TextSummarizer />} />
        <Route path="/tools/ats-checker" element={<ATSChecker />} />
        <Route path="/tools/caption-generator" element={<CaptionGenerator />} />
        <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
        <Route path="/tools/tamil-quote-generator" element={<TamilQuoteGenerator />} />
        <Route path="/tools/qr-code-generator" element={<QRCodeGenerator />} />
        <Route path="/tools/word-counter" element={<WordCounter />} />
        <Route path="/tools/color-palette-generator" element={<ColorPaletteGenerator />} />
      </Routes>
    </Layout>
  )
}
