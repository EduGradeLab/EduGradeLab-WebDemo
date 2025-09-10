'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import FileUpload from '@/components/FileUpload'
import { useRouter } from 'next/navigation'

interface UploadProgress {
  progress: number
  status: 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error'
  message: string
}

interface OCRResult {
  id: string
  filename: string
  uploadTime: string
  status: string
  ocrText?: string
  aiAnalysis?: string
  score?: number
}

export default function DemoHome() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [recentResults, setRecentResults] = useState<OCRResult[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadRecentResults()
  }, [])

  const loadRecentResults = async () => {
    try {
      const response = await fetch('/api/recent-results')
      if (response.ok) {
        const data = await response.json()
        setRecentResults(data.results || [])
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }))
        console.error('API error:', errorData.error)
      }
    } catch (error) {
      console.error('Results load error:', error)
      // Show user-friendly error without breaking the UI
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!file) {
      alert('Geçerli bir dosya seçin.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Dosya boyutu 10MB\'dan büyük olamaz.')
      return
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Desteklenmeyen dosya türü. Lütfen resim veya PDF dosyası seçin.')
      return
    }

    setIsUploading(true)
    setUploadProgress({
      progress: 0,
      status: 'uploading',
      message: 'Dosya yükleniyor...'
    })

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (!prev) return null
          if (prev.progress >= 100) {
            clearInterval(progressInterval)
            return prev
          }
          return {
            ...prev,
            progress: Math.min(prev.progress + 10, 100)
          }
        })
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)

      if (response.ok) {
        await response.json() // Parse response but don't store since we're using simulated progress
        
        setUploadProgress({
          progress: 100,
          status: 'processing',
          message: 'OCR işlemi başlatıldı...'
        })

        // Simulate processing
        setTimeout(() => {
          setUploadProgress({
            progress: 100,
            status: 'analyzing',
            message: 'Yapay zeka analizi yapılıyor...'
          })
        }, 2000)

        setTimeout(() => {
          setUploadProgress({
            progress: 100,
            status: 'completed',
            message: 'Analiz tamamlandı!'
          })
          setIsUploading(false)
          loadRecentResults()
        }, 4000)

      } else {
        const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }))
        throw new Error(errorData.error || 'Dosya yükleme başarısız')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadProgress({
        progress: 0,
        status: 'error',
        message: 'Hata: ' + (error as Error).message
      })
      setIsUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'processing': return 'text-blue-600 bg-blue-50'
      case 'analyzing': return 'text-purple-600 bg-purple-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploaded': return 'Yüklendi'
      case 'processing': return 'İşleniyor'
      case 'analyzing': return 'Analiz Ediliyor'
      case 'completed': return 'Tamamlandı'
      case 'error': return 'Hata'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="home" />
      
      <div className="lg:ml-64 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Sınav Analiz Paneli
            </h1>
            <p className="text-gray-600">
              Sınav kağıtlarınızı yükleyin ve yapay zeka ile analiz edin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Yeni Sınav Yükle</h2>
                
                <FileUpload
                  onFileSelect={handleFileSelect}
                  isUploading={isUploading}
                />

                {/* Progress Bar */}
                {uploadProgress && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {uploadProgress.message}
                      </span>
                      <span className="text-sm text-gray-500">
                        {uploadProgress.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadProgress.status === 'error' 
                            ? 'bg-red-500' 
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${uploadProgress.progress}%` }}
                      />
                    </div>
                    
                    {uploadProgress.status === 'completed' && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 font-medium">
                          ✅ Analiz tamamlandı! Sonuçları aşağıda görebilirsiniz.
                        </p>
                      </div>
                    )}
                    
                    {uploadProgress.status === 'error' && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-medium">
                          ❌ {uploadProgress.message}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Results */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Son İşlemler</h2>
                
                {recentResults.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      Henüz hiç işlem yapılmadı
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {result.filename}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(result.status)}`}>
                            {getStatusText(result.status)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(result.uploadTime).toLocaleString('tr-TR')}
                        </p>
                        {result.score && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Puan:</span>
                              <span className="text-sm font-semibold text-blue-600">
                                {result.score}/100
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {recentResults.length > 0 && (
                  <button
                    onClick={() => router.push('/document')}
                    className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Tümünü Gör →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}