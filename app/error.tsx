'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <button 
          onClick={reset} 
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
