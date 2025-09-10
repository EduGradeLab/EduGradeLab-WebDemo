'use client'

import { useEffect, useState } from 'react'

interface RealTimeProgressProps {
  jobId: string
  onProgressUpdate?: (progress: unknown) => void
  onComplete?: (result: unknown) => void
  onError?: (error: string) => void
}

interface ProgressData {
  status: 'waiting' | 'processing' | 'analyzing' | 'completed' | 'error'
  progress: number
  message: string
  timestamp: string
  data?: Record<string, unknown>
}

export default function RealTimeProgress({ 
  jobId, 
  onProgressUpdate, 
  onComplete, 
  onError 
}: RealTimeProgressProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')

  useEffect(() => {
    // For demo purposes, we'll use Server-Sent Events (SSE)
    // In production, you might use WebSocket or a polling mechanism
    let eventSource: EventSource | null = null

    const connectSSE = () => {
      try {
        eventSource = new EventSource(`/api/progress/${jobId}`)
        
        eventSource.onopen = () => {
          setConnectionStatus('connected')
          console.log('SSE connection established')
        }

        eventSource.onmessage = (event) => {
          try {
            const data: ProgressData = JSON.parse(event.data)
            setProgress(data)
            onProgressUpdate?.(data)

            if (data.status === 'completed') {
              onComplete?.(data.data)
              eventSource?.close()
            } else if (data.status === 'error') {
              onError?.(data.message)
              eventSource?.close()
            }
          } catch (parseError) {
            console.error('Error parsing SSE message:', parseError)
          }
        }

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error)
          setConnectionStatus('error')
          
          // Fallback to polling if SSE fails
          if (eventSource) {
            eventSource.close()
          }
          startPolling()
        }
      } catch (error) {
        console.error('Failed to establish SSE connection:', error)
        setConnectionStatus('error')
        startPolling()
      }
    }

    let pollingInterval: NodeJS.Timeout | null = null

    const startPolling = () => {
      // Fallback polling mechanism
      pollingInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/progress/${jobId}`)
          if (response.ok) {
            const data: ProgressData = await response.json()
            setProgress(data)
            onProgressUpdate?.(data)

            if (data.status === 'completed') {
              onComplete?.(data.data)
              if (pollingInterval) {
                clearInterval(pollingInterval)
              }
            } else if (data.status === 'error') {
              onError?.(data.message)
              if (pollingInterval) {
                clearInterval(pollingInterval)
              }
            }
          }
        } catch (error) {
          console.error('Polling error:', error)
        }
      }, 2000) // Poll every 2 seconds
    }

    // Start with SSE
    connectSSE()

    // Cleanup
    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [jobId, onProgressUpdate, onComplete, onError])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-gray-600 bg-gray-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'analyzing': return 'text-purple-600 bg-purple-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        )
      case 'processing':
      case 'analyzing':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        )
      case 'completed':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return (
          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
        )
    }
  }

  if (!progress) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Bağlanıyor...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-gray-500">
            {connectionStatus === 'connected' ? 'Canlı' :
             connectionStatus === 'connecting' ? 'Bağlanıyor' : 'Bağlantı hatası'}
          </span>
        </div>
        <span className="text-gray-400">
          {new Date(progress.timestamp).toLocaleTimeString('tr-TR')}
        </span>
      </div>

      {/* Progress Status */}
      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
        {getStatusIcon(progress.status)}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(progress.status)}`}>
              {progress.status === 'waiting' && 'Bekliyor'}
              {progress.status === 'processing' && 'İşleniyor'}
              {progress.status === 'analyzing' && 'AI Analizi'}
              {progress.status === 'completed' && 'Tamamlandı'}
              {progress.status === 'error' && 'Hata'}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {progress.progress}%
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {progress.message}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            progress.status === 'error' ? 'bg-red-500' : 'bg-blue-600'
          }`}
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      {/* Error Message */}
      {progress.status === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            ❌ {progress.message}
          </p>
        </div>
      )}

      {/* Success Message */}
      {progress.status === 'completed' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ İşlem başarıyla tamamlandı!
          </p>
        </div>
      )}

      {/* Additional Data */}
      {progress.data && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">İşlem Detayları</h4>
          <div className="space-y-2">
            {Object.entries(progress.data).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-blue-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-blue-900 font-medium">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}