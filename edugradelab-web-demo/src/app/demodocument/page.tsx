'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

interface Document {
  id: string
  filename: string
  uploadTime: string
  status: 'completed' | 'processing' | 'failed' | 'pending' | 'analysis_pending' | 'analysis_completed' | 'analysis_failed'
  score?: number
  processingTime?: number
  ocrText?: string
  aiAnalysis?: string
  name?: string
  fileType?: 'pdf' | 'image'
  fileSize?: string
}

export default function DemoDocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filter, setFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all')
  const [loading, setLoading] = useState(true)

  // Gerçek API'den veri çek
  useEffect(() => {
    fetchDocuments()
  }, [filter])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const statusParam = filter === 'all' ? '' : `&status=${filter}`
      const response = await fetch(`/api/documents?limit=50${statusParam}`)
      const data = await response.json()

      if (data.success) {
        setDocuments(data.documents)
      } else {
        console.error('API Error:', data.error)
        // Hata durumunda demo veriler göster
        setDocuments(getDemoDocuments())
      }
    } catch (error) {
      console.error('Fetch Error:', error)
      // Network hatası durumunda demo veriler göster
      setDocuments(getDemoDocuments())
    } finally {
      setLoading(false)
    }
  }

  // Demo veriler - API başarısız olursa kullanılacak
  const getDemoDocuments = (): Document[] => [
    {
      id: '1',
      filename: 'matematik_sinavi_9a.pdf',
      uploadTime: '2024-12-19T14:30:00.000Z',
      status: 'completed',
      score: 85,
      processingTime: 135000,
      name: 'Matematik Sınavı - 9A Sınıfı',
      fileType: 'pdf',
      fileSize: '2.4 MB'
    },
    {
      id: '2',
      filename: 'fizik_quiz_kuvvet.jpg',
      uploadTime: '2024-12-19T13:15:00.000Z',
      status: 'completed',
      score: 92,
      processingTime: 105000,
      name: 'Fizik Quiz - Kuvvet ve Hareket',
      fileType: 'image',
      fileSize: '1.8 MB'
    },
    {
      id: '3',
      filename: 'kimya_sinavi_periyodik.pdf',
      uploadTime: '2024-12-19T15:45:00.000Z',
      status: 'processing',
      name: 'Kimya Sınavı - Periyodik Tablo',
      fileType: 'pdf',
      fileSize: '3.1 MB'
    }
  ]

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true
    if (filter === 'completed') return doc.status === 'completed' || doc.status === 'analysis_completed'
    if (filter === 'processing') return doc.status === 'processing' || doc.status === 'analysis_pending' || doc.status === 'pending'
    if (filter === 'failed') return doc.status === 'failed' || doc.status === 'analysis_failed'
    return true
  })

  const getStatusBadge = (status: Document['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      analysis_completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      analysis_pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      analysis_failed: 'bg-red-100 text-red-800 border-red-200'
    }
    
    const labels = {
      completed: '✅ Tamamlandı',
      analysis_completed: '✅ Tamamlandı',
      processing: '⏳ İşleniyor',
      analysis_pending: '⏳ Analiz Bekleniyor',
      pending: '⏳ Beklemede',
      failed: '❌ Başarısız',
      analysis_failed: '❌ Analiz Başarısız'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.pending}`}>
        {labels[status] || labels.pending}
      </span>
    )
  }

  const getFileIcon = (fileType?: 'pdf' | 'image') => {
    if (!fileType) return '📄'
    return fileType === 'pdf' ? '📄' : '🖼️'
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('tr-TR')
    } catch {
      return dateString
    }
  }

  const formatProcessingTime = (timeMs?: number) => {
    if (!timeMs) return undefined
    const seconds = Math.floor(timeMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes} dk ${remainingSeconds} sn`
    }
    return `${remainingSeconds} sn`
  }

  const getFileSize = (doc: Document) => {
    if (doc.fileSize) return doc.fileSize
    // Fallback: filename'dan tahmin et
    return '~2 MB'
  }

  const getDisplayName = (doc: Document) => {
    if (doc.name) return doc.name
    // Filename'dan güzel isim oluştur
    return doc.filename
      .replace(/\.[^/.]+$/, '') // Extension'ı kaldır
      .replace(/[_-]/g, ' ') // Alt çizgi ve tire'yi boşlukla değiştir
      .replace(/\b\w/g, l => l.toUpperCase()) // İlk harfleri büyük yap
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Sidebar activePage="documents" />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6"></div>
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar activePage="documents" />
      
      <div className="flex-1 lg:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              📋 Dokümanlar
            </h1>
            <p className="text-gray-600 text-lg">
              Yüklediğiniz sınav kağıtları ve analiz sonuçları
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Toplam</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">✅</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Tamamlanan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(d => d.status === 'completed' || d.status === 'analysis_completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">⏳</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">İşleniyor</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(d => d.status === 'processing' || d.status === 'analysis_pending' || d.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📈</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Ort. Puan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(() => {
                      const scoredDocs = documents.filter(d => d.score !== undefined)
                      if (scoredDocs.length === 0) return 0
                      const avg = scoredDocs.reduce((acc, d) => acc + (d.score || 0), 0) / scoredDocs.length
                      return Math.round(avg)
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6 p-1 bg-white rounded-xl border border-gray-200 w-fit">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'completed', label: 'Tamamlanan' },
              { key: 'processing', label: 'İşleniyor' },
              { key: 'failed', label: 'Başarısız' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === tab.key 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">📭</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz doküman yok</h3>
                <p className="text-gray-600 mb-6">İlk sınav kağıdınızı yükleyerek başlayın</p>
                <a
                  href="/demohome"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  📤 Dosya Yükle
                </a>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{getFileIcon(doc.fileType)}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{getDisplayName(doc)}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>📅 {formatDate(doc.uploadTime)}</span>
                          <span>💾 {getFileSize(doc)}</span>
                          {formatProcessingTime(doc.processingTime) && (
                            <span>⏱️ {formatProcessingTime(doc.processingTime)}</span>
                          )}
                        </div>
                        
                        {(doc.status === 'completed' || doc.status === 'analysis_completed') && doc.score !== undefined && (
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Puan:</span>
                              <span className="text-lg font-bold text-blue-600">{doc.score}/100</span>
                            </div>
                            {doc.aiAnalysis && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Analiz:</span>
                                <span className="text-sm text-green-600 font-medium">Tamamlandı</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(doc.status)}
                      {(doc.status === 'completed' || doc.status === 'analysis_completed') && (
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-200">
                          📊 Detay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
