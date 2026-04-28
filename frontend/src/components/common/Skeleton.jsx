export function SkeletonBlock({ className = '', height = 'h-4' }) {
  return <div className={`skeleton rounded-xl ${height} ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="card space-y-3">
      <SkeletonBlock height="h-5" className="w-1/3" />
      <SkeletonBlock height="h-3" className="w-full" />
      <SkeletonBlock height="h-3" className="w-4/5" />
      <SkeletonBlock height="h-3" className="w-2/3" />
    </div>
  )
}

export function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size]
  return (
    <div className={`${s} ${className}`}>
      <svg className="animate-spin w-full h-full text-brand-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}
