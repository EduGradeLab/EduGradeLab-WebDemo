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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar activePage="upload" />
      
      <div className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Sınav Analiz Paneli
                </h1>
                <p className="text-gray-600 text-lg">
                  Sınav kağıtlarınızı yükleyin ve yapay zeka ile profesyonel analiz alın
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Hızlı Yükleme</h3>
                    <p className="text-sm text-gray-600">10MB&apos;a kadar dosya</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Analiz</h3>
                    <p className="text-sm text-gray-600">Saniyeler içinde</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Detaylı Rapor</h3>
                    <p className="text-sm text-gray-600">Anında sonuçlar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="xl:col-span-2">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Yeni Sınav Yükle</h2>
                </div>
                
                <FileUpload
                  onFileSelect={handleFileSelect}
                  isUploading={isUploading}
                />

                {/* Enhanced Progress Bar */}
                {uploadProgress && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${
                          uploadProgress.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-lg font-semibold text-gray-900">
                          {uploadProgress.message}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {uploadProgress.progress}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          uploadProgress.status === 'error' 
                            ? 'bg-gradient-to-r from-red-500 to-red-600' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}
                        style={{ width: `${uploadProgress.progress}%` }}
                      />
                    </div>
                    
                    {/* Status Cards */}
                    {uploadProgress.status === 'completed' && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-green-900">Analiz Tamamlandı!</h3>
                            <p className="text-green-700">Sonuçları aşağıda görebilirsiniz.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {uploadProgress.status === 'error' && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-red-900">Hata Oluştu</h3>
                            <p className="text-red-700">{uploadProgress.message}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Instructions */}
                {!uploadProgress && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Nasıl Kullanılır?</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">1</span>
                        </div>
                        <p className="text-gray-700">Sınav kağıdınızın fotoğrafını çekin veya PDF dosyasını hazırlayın</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">2</span>
                        </div>
                        <p className="text-gray-700">Dosyayı yukarıdaki alana sürükleyin veya tıklayarak seçin</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">3</span>
                        </div>
                        <p className="text-gray-700">AI analizi otomatik olarak başlayacak ve sonuçları göreceksiniz</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Recent Results */}
            <div className="xl:col-span-1">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Son İşlemler</h2>
                  </div>
                  {recentResults.length > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {recentResults.length}
                    </span>
                  )}
                </div>
                
                {recentResults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Analiz Yok</h3>
                    <p className="text-gray-500 text-sm">
                      İlk sınav kağıdınızı yükleyerek başlayın
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {result.filename}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                            {getStatusText(result.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{new Date(result.uploadTime).toLocaleString('tr-TR')}</span>
                          {result.score && (
                            <div className="flex items-center space-x-1">
                              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-semibold text-yellow-600">{result.score}/100</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center text-xs text-blue-600 group-hover:text-blue-700">
                          <span>Detayları gör</span>
                          <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {recentResults.length > 0 && (
                  <button
                    onClick={() => router.push('/document')}
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Tüm Sonuçları Gör
                    <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
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