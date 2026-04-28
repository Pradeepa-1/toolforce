// AdSense Ad Slot Component
// Replace the placeholder divs with actual Google AdSense code when approved
// Example: <ins className="adsbygoogle" data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" />

export default function AdSlot({ type = 'banner', label, className = '' }) {
  const sizes = {
    banner: { minHeight: '90px', maxWidth: '728px' },
    rectangle: { minHeight: '250px', maxWidth: '300px' },
    'in-content': { minHeight: '90px', width: '100%' },
  }

  const s = sizes[type] || sizes.banner

  return (
    <div
      className={`ad-slot w-full mx-auto flex flex-col items-center justify-center gap-1 ${className}`}
      style={s}
    >
      {/* ===== AdSense Ad Slot Here ===== */}
      {/* Replace this div with your actual AdSense code snippet */}
      {/* <ins className="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
      <span className="text-zinc-700 text-[10px] uppercase tracking-widest">Advertisement</span>
      <span className="text-zinc-800 text-[10px]">{label || 'Ad Slot'}</span>
    </div>
  )
}
