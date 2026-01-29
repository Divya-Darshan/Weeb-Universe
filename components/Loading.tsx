// components/Loading.tsx
export default function Loading({ show = true }: { show?: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 p-8">
        {/* Minimal spinner */}
        <div className="w-12 h-12 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
        
        {/* Clean text */}
        <div className="text-center">
          <p className="text-slate-300 font-medium text-lg tracking-wide">Loading</p>
          <p className="text-sm text-slate-500">Weeb Universe</p>
        </div>
      </div>
    </div>
  )
}
