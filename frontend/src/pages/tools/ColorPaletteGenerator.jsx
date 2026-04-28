import { useState, useCallback } from 'react'
import { Copy, Check, RefreshCw, Download } from 'lucide-react'
import SEO from '../../components/common/SEO'
import ToolPage from '../../components/common/ToolPage'
import toast from 'react-hot-toast'

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  let h, s, l = (max+min)/2
  if (max === min) { h = s = 0 } else {
    const d = max-min; s = l > 0.5 ? d/(2-max-min) : d/(max+min)
    switch(max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break
      case g: h = ((b-r)/d + 2)/6; break
      case b: h = ((r-g)/d + 4)/6; break
    }
  }
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)]
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1-l)
  const f = n => { const k = (n+h/30)%12; const color = l - a*Math.max(Math.min(k-3,9-k,1),-1); return Math.round(255*color).toString(16).padStart(2,'0') }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generatePalette(baseHex, mode) {
  const [h, s, l] = hexToHsl(baseHex)
  switch (mode) {
    case 'complementary': return [baseHex, hslToHex((h+180)%360, s, l), hslToHex(h, s, Math.min(90,l+20)), hslToHex((h+180)%360, s, Math.min(90,l+20)), hslToHex(h, Math.max(10,s-20), l)]
    case 'analogous': return [hslToHex((h+330)%360,s,l), hslToHex((h+345)%360,s,l), baseHex, hslToHex((h+15)%360,s,l), hslToHex((h+30)%360,s,l)]
    case 'triadic': return [baseHex, hslToHex((h+120)%360,s,l), hslToHex((h+240)%360,s,l), hslToHex((h+60)%360,Math.max(10,s-15),l), hslToHex((h+180)%360,Math.max(10,s-15),Math.min(90,l+10))]
    case 'monochromatic': return [hslToHex(h,s,Math.max(10,l-30)), hslToHex(h,s,Math.max(10,l-15)), baseHex, hslToHex(h,s,Math.min(90,l+15)), hslToHex(h,s,Math.min(90,l+30))]
    case 'shades': return [hslToHex(h,s,15), hslToHex(h,s,30), hslToHex(h,s,50), hslToHex(h,s,70), hslToHex(h,s,85)]
    default: return [baseHex]
  }
}

function randomHex() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return `rgb(${r}, ${g}, ${b})`
}

const MODES = [
  { id: 'complementary', label: 'Complementary', emoji: '🔄' },
  { id: 'analogous',     label: 'Analogous',     emoji: '🎨' },
  { id: 'triadic',       label: 'Triadic',        emoji: '🔺' },
  { id: 'monochromatic', label: 'Monochromatic',  emoji: '🌊' },
  { id: 'shades',        label: 'Shades',         emoji: '⬛' },
]

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#14b8a6')
  const [mode, setMode] = useState('complementary')
  const [copiedIdx, setCopiedIdx] = useState(null)

  const palette = generatePalette(baseColor, mode)

  const copy = (hex, i) => {
    navigator.clipboard.writeText(hex)
    setCopiedIdx(i)
    setTimeout(() => setCopiedIdx(null), 1500)
    toast.success(`Copied ${hex}!`)
  }

  const randomize = () => setBaseColor(randomHex())

  const exportCSS = () => {
    const css = `:root {\n${palette.map((c, i) => `  --color-${i+1}: ${c};`).join('\n')}\n}`
    navigator.clipboard.writeText(css)
    toast.success('CSS variables copied!')
  }

  const isLight = (hex) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
    return (0.299*r + 0.587*g + 0.114*b) > 128
  }

  return (
    <>
      <SEO
        title="Free Color Palette Generator — Create Beautiful Color Schemes"
        description="Generate complementary, analogous, triadic and monochromatic color palettes instantly. Copy HEX, RGB, HSL. Export CSS variables. Free color palette tool."
        keywords="color palette generator, color scheme generator, complementary colors, hex color picker, css color palette"
      />
      <ToolPage
        icon="🎨"
        title="Color Palette Generator"
        description="Generate beautiful color palettes from any base color. Complementary, analogous, triadic, monochromatic — copy HEX, RGB, export CSS variables."
        badge="✦ 5 Palette Modes • HEX + RGB + HSL • CSS Export"
        affiliateType="canva"
      >
        <div className="space-y-4">
          {/* Base Color Picker */}
          <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.07] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Base Color</p>
              <button onClick={randomize} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                <RefreshCw className="w-3 h-3" /> Random
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input type="color" value={baseColor} onChange={e => setBaseColor(e.target.value)}
                className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent" />
              <div>
                <input type="text" value={baseColor} onChange={e => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setBaseColor(e.target.value) }}
                  className="w-28 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-sm font-mono text-white focus:outline-none focus:border-teal-500/50" />
                <p className="text-xs text-zinc-500 mt-1">{hexToRgb(baseColor)}</p>
              </div>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap gap-2">
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border
                  ${mode === m.id ? 'border-teal-500/50 bg-teal-500/10 text-teal-300' : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20'}`}>
                <span>{m.emoji}</span>{m.label}
              </button>
            ))}
          </div>

          {/* Palette Display */}
          <div className="space-y-2">
            <div className="flex rounded-2xl overflow-hidden h-24">
              {palette.map((c, i) => (
                <div key={i} className="flex-1 cursor-pointer hover:scale-105 transition-transform duration-200"
                  style={{ background: c }} onClick={() => copy(c, i)} />
              ))}
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${palette.length}, 1fr)` }}>
              {palette.map((c, i) => {
                const [h, s, l] = hexToHsl(c)
                return (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/[0.08]">
                    <div className="h-14 cursor-pointer relative group" style={{ background: c }} onClick={() => copy(c, i)}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedIdx === i
                          ? <Check className={`w-4 h-4 ${isLight(c) ? 'text-black/60' : 'text-white/80'}`} />
                          : <Copy className={`w-4 h-4 ${isLight(c) ? 'text-black/60' : 'text-white/80'}`} />
                        }
                      </div>
                    </div>
                    <div className="p-2 bg-white/[0.03] space-y-0.5">
                      <p className="text-[10px] font-mono text-white font-medium">{c.toUpperCase()}</p>
                      <p className="text-[9px] text-zinc-600">{hexToRgb(c)}</p>
                      <p className="text-[9px] text-zinc-600">hsl({h},{s}%,{l}%)</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export */}
          <div className="flex gap-2">
            <button onClick={exportCSS} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm">
              <Copy className="w-4 h-4" /> Copy CSS Variables
            </button>
            <button onClick={() => { navigator.clipboard.writeText(palette.join(', ')); toast.success('Copied all HEX!') }}
              className="btn-secondary flex items-center justify-center gap-2 py-2.5 px-4 text-sm">
              <Download className="w-4 h-4" /> Copy HEX
            </button>
          </div>

          {/* Tips */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['🎨 5 Harmony Types', 'Complementary, analogous, triadic, monochromatic, and shades.'],
              ['💡 CSS Export', 'Copy as CSS variables — paste straight into your stylesheet.'],
              ['🖱️ Click to Copy', 'Click any color swatch to instantly copy the HEX code.'],
              ['🎲 Randomize', 'Not sure where to start? Hit Random for instant inspiration.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.05]">
                <p className="text-xs font-semibold text-white">{title}</p>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ToolPage>
    </>
  )
}
