'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Bir Hata Oluştu</h2>
            <p className="text-gray-600 mb-4">
              Üzgünüz, beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
            <button
              onClick={reset}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}