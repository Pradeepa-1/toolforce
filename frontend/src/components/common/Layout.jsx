import Navbar from './Navbar'
import Footer from './Footer'
import AdSlot from '../ads/AdSlot'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Top Banner Ad */}
      <div className="w-full px-4 pt-2 pb-1">
        <AdSlot type="banner" label="Top Banner — 728×90" />
      </div>
      <main className="flex-1">
        {children}
      </main>
      {/* Bottom Ad */}
      <div className="w-full px-4 py-4">
        <AdSlot type="banner" label="Bottom Banner — 728×90" />
      </div>
      <Footer />
    </div>
  )
}
