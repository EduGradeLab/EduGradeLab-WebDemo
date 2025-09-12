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

interface JobOperation {
  id: number
  jobId: number
  filename: string
  operation: string
  level: string
  status: string
  score?: number
  createdAt: string
  documentId?: number
  ocrText?: string
  aiAnalysis?: string
}

interface CurrentOCRResult {
  ocrText: string
  aiAnalysis: string
  processingTime?: number
}

export default function DemoHome() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [recentOperations, setRecentOperations] = useState<JobOperation[]>([])
  const [currentOCRResult, setCurrentOCRResult] = useState<CurrentOCRResult | null>(null)
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
        setRecentOperations(data.data || [])
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }))
        console.error('API error:', errorData.error)
      }
    } catch (error) {
      console.error('Results load error:', error)
      // Show user-friendly error without breaking the UI
    }
  }

  const startJobStatusPolling = (jobId: number) => {
    console.log('Starting job status polling for job:', jobId)
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/job-status/${jobId}`)
        
        if (response.ok) {
          const jobData = await response.json()
          console.log('Job status details:', {
            jobId: jobData.job.id,
            status: jobData.job.status,
            hasResult: !!jobData.result,
            resultData: jobData.result
          })
          
          switch (jobData.job.status) {
            case 'WAITING':
              setUploadProgress({
                progress: 100,
                status: 'processing',
                message: 'OCR işlemi sıraya alındı...'
              })
              break
              
            case 'PROCESSING':
              setUploadProgress({
                progress: 100,
                status: 'analyzing',
                message: 'OCR ve AI analizi yapılıyor...'
              })
              break
              
            case 'DONE':
              clearInterval(pollInterval)
              setUploadProgress({
                progress: 100,
                status: 'completed',
                message: 'Analiz tamamlandı!'
              })
              setIsUploading(false)
              loadRecentResults()
              
              // OCR sonuçlarını göster
              if (jobData.result) {
                setCurrentOCRResult({
                  ocrText: jobData.result.ocr_text || 'OCR metni bulunamadı',
                  aiAnalysis: jobData.result.ai_analysis || 'AI analizi bulunamadı',
                  processingTime: jobData.result.processing_time_ms
                })
                
                console.log('OCR Results:', {
                  text: jobData.result.ocr_text,
                  analysis: jobData.result.ai_analysis,
                  processingTime: jobData.result.processing_time_ms
                })
              }
              break
              
            case 'ERROR':
              clearInterval(pollInterval)
              setUploadProgress({
                progress: 0,
                status: 'error',
                message: 'OCR işlemi başarısız: ' + (jobData.examImage?.error_message || 'Bilinmeyen hata')
              })
              setIsUploading(false)
              break
          }
        } else {
          console.error('Job status check failed:', response.status)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 2000) // Her 2 saniyede bir kontrol et

    // 5 dakika sonra polling'i durdur (timeout)
    setTimeout(() => {
      clearInterval(pollInterval)
      if (isUploading) {
        setUploadProgress({
          progress: 0,
          status: 'error',
          message: 'İşlem zaman aşımına uğradı'
        })
        setIsUploading(false)
      }
    }, 300000) // 5 dakika timeout
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
    setCurrentOCRResult(null) // Önceki sonuçları temizle
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
        const uploadResult = await response.json()
        console.log('Upload successful:', uploadResult)
        
        setUploadProgress({
          progress: 100,
          status: 'processing',
          message: 'OCR işlemi başlatıldı... Webhook yanıtı bekleniyor...'
        })

        // Job status polling başlat
        startJobStatusPolling(uploadResult.jobId)

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
      case 'WAITING': return 'Bekliyor'
      case 'PROCESSING': return 'İşleniyor'
      case 'DONE': return 'Tamamlandı'
      case 'ERROR': return 'Hata'
      default: return status
    }
  }

  const getOperationLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-600 bg-blue-50'
      case 'WARNING': return 'text-yellow-600 bg-yellow-50'
      case 'ERROR': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getOperationLevelText = (level: string) => {
    switch (level) {
      case 'INFO': return 'Bilgi'
      case 'WARNING': return 'Uyarı'
      case 'ERROR': return 'Hata'
      default: return level
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Sidebar activePage="upload" />
      
      <div className="flex-1 lg:ml-0 p-4 lg:p-8 min-h-screen">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2">
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

                {/* OCR Results Display */}
                {currentOCRResult && (
                  <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-900">OCR ve AI Analizi Sonuçları</h3>
                        <p className="text-green-700">
                          {currentOCRResult.processingTime && `İşlem süresi: ${currentOCRResult.processingTime}ms`}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* OCR Text Results */}
                      <div className="bg-white rounded-xl p-5 border border-green-100">
                        <div className="flex items-center space-x-2 mb-4">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <h4 className="text-lg font-semibold text-gray-900 truncate">OCR Metni</h4>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto custom-scrollbar">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono break-words">
                            {currentOCRResult.ocrText}
                          </pre>
                        </div>
                      </div>

                      {/* AI Analysis Results */}
                      <div className="bg-white rounded-xl p-5 border border-green-100">
                        <div className="flex items-center space-x-2 mb-4">
                          <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <h4 className="text-lg font-semibold text-gray-900 truncate">AI Analizi</h4>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto custom-scrollbar">
                          <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                            {currentOCRResult.aiAnalysis}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button
                        onClick={() => setCurrentOCRResult(null)}
                        className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        Sonuçları Gizle
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`OCR Metni:\n${currentOCRResult.ocrText}\n\nAI Analizi:\n${currentOCRResult.aiAnalysis}`)
                          alert('Sonuçlar panoya kopyalandı!')
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Panoya Kopyala
                      </button>
                    </div>
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
            <div className="lg:col-span-1">
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
                  {recentOperations.length > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {recentOperations.length}
                    </span>
                  )}
                </div>
                
                {recentOperations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz İşlem Yok</h3>
                    <p className="text-gray-500 text-sm">
                      İlk sınav kağıdınızı yükleyerek başlayın
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {recentOperations.map((operation) => (
                      <div
                        key={operation.id}
                        className="p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors flex-1 mr-2">
                            {operation.filename}
                          </h3>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOperationLevelColor(operation.level)}`}>
                              {getOperationLevelText(operation.level)}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operation.status)}`}>
                              {getStatusText(operation.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 mb-2 sm:mb-3">
                          <span className="truncate flex-1">{new Date(operation.createdAt).toLocaleString('tr-TR', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                          {operation.score && (
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-semibold text-yellow-600">{operation.score}/100</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2">
                          <p className="font-medium">{operation.operation}</p>
                        </div>
                        
                        {operation.documentId && (
                          <div className="flex items-center text-xs text-blue-600 group-hover:text-blue-700">
                            <span>Detayları gör</span>
                            <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {recentOperations.length > 0 && (
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