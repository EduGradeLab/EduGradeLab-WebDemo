'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'


import Sidebar from '@/components/Sidebar'

interface Document {
  id: string
  filename: string
  uploadTime: string
  status: 'completed' | 'processing' | 'failed' | 'pending' | 'uploaded' | 'analyzing' | 'error'
  score?: number
  processingTime?: number
  ocrText?: string
  aiAnalysis?: string
  name?: string
  fileType?: 'pdf' | 'image'
  fileSize?: string
  operations?: JobOperation[]
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

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function DocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [loadingDocumentId, setLoadingDocumentId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const debouncedSearchRef = useRef<NodeJS.Timeout | null>(null)
  const debouncedFilterRef = useRef<NodeJS.Timeout | null>(null)

  const loadDocuments = useCallback(async (page?: number) => {
    setLoading(true)
    setIsFilterLoading(true)
    try {
      const currentPage = page || pagination.page
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })

      const response = await fetch(`/api/documents?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
        setPagination(data.pagination || pagination)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }))
        console.error('API error:', errorData.error)
        setDocuments([])
      }
    } catch (error) {
      console.error('Documents load error:', error)
      setDocuments([])
    } finally {
      setLoading(false)
      setIsFilterLoading(false)
    }
  }, [pagination.limit, searchTerm, statusFilter]) // pagination.page'ı dependency'den çıkardık

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const loadDocumentDetails = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/details`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.document) {
          return data.document
        }
      }
      return null
    } catch (error) {
      console.error('Document details error:', error)
      return null
    }
  }

  // Search veya filter değiştiğinde sayfayı 1'e döndür
  useEffect(() => {
    // Clear previous timeouts
    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current)
    }
    if (debouncedFilterRef.current) {
      clearTimeout(debouncedFilterRef.current)
    }
    
    // Debounce search/filter changes
    debouncedSearchRef.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
      loadDocuments(1)
    }, 300)
    
    return () => {
      if (debouncedSearchRef.current) {
        clearTimeout(debouncedSearchRef.current)
      }
    }
  }, [searchTerm, statusFilter])

  const getStatusBadge = (status: Document['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      analyzing: 'bg-purple-100 text-purple-800 border-purple-200',
      uploaded: 'bg-blue-100 text-blue-800 border-blue-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      WAITING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PROCESSING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      DONE: 'bg-green-100 text-green-800 border-green-200',
      ERROR: 'bg-red-100 text-red-800 border-red-200'
    }
    
    const labels = {
      completed: '✅ Tamamlandı',
      processing: '⏳ İşleniyor',
      pending: '⏳ Beklemede',
      analyzing: '🔍 Analiz Ediliyor',
      uploaded: '📤 Yüklendi',
      failed: '❌ Başarısız',
      error: '❌ Hata',
      WAITING: '⏳ Bekliyor',
      PROCESSING: '⏳ İşleniyor',
      DONE: '✅ Tamamlandı',
      ERROR: '❌ Hata'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.pending}`}>
        {labels[status] || labels.pending}
      </span>
    )
  }

  const getStatusBadgeColor = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      analyzing: 'bg-purple-100 text-purple-800',
      uploaded: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      error: 'bg-red-100 text-red-800',
      WAITING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-yellow-100 text-yellow-800',
      DONE: 'bg-green-100 text-green-800',
      ERROR: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const getStatusBadgeText = (status: string) => {
    const labels = {
      completed: '✅ Tamamlandı',
      processing: '⏳ İşleniyor',
      pending: '⏳ Beklemede',
      analyzing: '🔍 Analiz Ediliyor',
      uploaded: '📤 Yüklendi',
      failed: '❌ Başarısız',
      error: '❌ Hata',
      WAITING: '⏳ Bekliyor',
      PROCESSING: '⏳ İşleniyor',
      DONE: '✅ Tamamlandı',
      ERROR: '❌ Hata'
    }
    return labels[status as keyof typeof labels] || labels.pending
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
    return '~2 MB'
  }

  const getDisplayName = (doc: Document) => {
    if (doc.name) return doc.name
    return doc.filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
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

  const loadDocumentOperations = async (documentId: string) => {
    try {
      const response = await fetch(`/api/recent-results?limit=50`)
      if (response.ok) {
        const data = await response.json()
        // Filter operations to only show those related to this document
        const operations = data.data || []
        return operations.filter((op: JobOperation) => op.documentId === parseInt(documentId))
      }
      return []
    } catch (error) {
      console.error('Operations load error:', error)
      return []
    }
  }

  const filteredDocuments = documents.filter(doc => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'completed') return doc.status === 'completed'
    if (statusFilter === 'processing') return doc.status === 'processing' || doc.status === 'analyzing' || doc.status === 'pending' || doc.status === 'uploaded'
    if (statusFilter === 'failed') return doc.status === 'failed' || doc.status === 'error'
    return true
  })

  const handleDetailClick = async (doc: Document) => {
    // Prevent multiple clicks on the same document
    if (loadingDocumentId === doc.id) return
    
    setLoadingDocumentId(doc.id)
    
    try {
      const details = await loadDocumentDetails(doc.id)
      const operations = await loadDocumentOperations(doc.id)
      
      if (details) {
        // Use fresh data from the details API, completely replace cached data
        const freshDocument = {
          id: details.id,
          filename: details.filename,
          uploadTime: details.uploadTime,
          status: details.status,
          fileType: details.fileType,
          fileSize: details.fileSize,
          score: details.score,
          ocrText: details.ocrResult?.ocr_text || null,
          aiAnalysis: details.ocrResult?.ai_analysis || null,
          displayName: details.displayName,
          operations: operations
        }
        setSelectedDocument(freshDocument)
      } else {
        setSelectedDocument({ ...doc, operations })
      }
    } finally {
      setLoadingDocumentId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <Sidebar activePage="documents" />

      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  📋 Belgelerim
                </h1>
                <p className="text-gray-600 text-lg">
                  Yüklediğiniz sınav kağıtları ve analiz sonuçları
                </p>
              </div>
              <Link 
                href="/"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Ana Sayfa</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Toplam</p>
                  <p className="text-xl font-bold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">✅</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Tamamlanan</p>
                  <p className="text-xl font-bold text-gray-900">
                    {documents.filter(d => d.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">⏳</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">İşleniyor</p>
                  <p className="text-xl font-bold text-gray-900">
                    {documents.filter(d => d.status === 'processing' || d.status === 'analyzing' || d.status === 'pending' || d.status === 'uploaded').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📈</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Ort. Puan</p>
                  <p className="text-xl font-bold text-gray-900">
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

          {/* Search and Filter */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 mb-6 hover:shadow-xl transition-all duration-300 card-hover">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Dosya adıyla ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="completed">Tamamlanan</option>
                  <option value="processing">İşleniyor</option>
                  <option value="failed">Başarısız</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'completed', label: 'Tamamlanan' },
              { key: 'processing', label: 'İşleniyor' },
              { key: 'failed', label: 'Başarısız' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                disabled={isFilterLoading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 button-hover ${
                  statusFilter === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isFilterLoading && statusFilter !== tab.key ? '⏳' : tab.label}
              </button>
            ))}
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Yükleniyor...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">📭</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz doküman yok</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Arama kriterlerinize uygun belge bulunamadı.' 
                    : 'İlk sınav kağıdınızı yükleyerek başlayın'
                  }
                </p>
                <a
                  href="/demohome"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 button-hover"
                >
                  📤 Dosya Yükle
                </a>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-xl transition-all duration-300 card-hover">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{getFileIcon(doc.fileType)}</span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{getDisplayName(doc)}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                          <span>📅 {formatDate(doc.uploadTime)}</span>
                          <span>💾 {getFileSize(doc)}</span>
                          {formatProcessingTime(doc.processingTime) && (
                            <span>⏱️ {formatProcessingTime(doc.processingTime)}</span>
                          )}
                        </div>

                        {doc.status === 'completed' && doc.score !== undefined && (
                          <div className="flex flex-wrap items-center gap-4">
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
                      {doc.status === 'completed' && (
                        <button
                          onClick={() => handleDetailClick(doc)}
                          disabled={loadingDocumentId === doc.id}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-200 button-hover disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingDocumentId === doc.id ? '⏳ Yükleniyor...' : '📊 Detay'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 flex justify-between w-full sm:w-auto">
                <button
                  onClick={() => loadDocuments(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Önceki
                </button>
                <button
                  onClick={() => loadDocuments(Math.min(pagination.totalPages, pagination.page + 1))}
                  disabled={pagination.page === pagination.totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sonraki
                </button>
              </div>
              
              <div className="text-sm text-gray-700 text-center">
                <span className="font-medium">{pagination.total}</span> belgeden 
                <span className="font-medium"> {(pagination.page - 1) * pagination.limit + 1}</span> - 
                <span className="font-medium"> {Math.min(pagination.page * pagination.limit, pagination.total)}</span> arası
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-in-up border border-white/20">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 mr-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate" title={selectedDocument.filename}>
                    {getDisplayName(selectedDocument)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(selectedDocument.uploadTime)}
                    </span>
                    {getStatusBadge(selectedDocument.status)}
                    {selectedDocument.score && (
                      <span className="font-semibold text-blue-600 flex items-center">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {selectedDocument.score}/100
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {selectedDocument.ocrText && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        OCR Sonucu
                      </h4>
                      <button
                        onClick={() => selectedDocument.ocrText && navigator.clipboard.writeText(selectedDocument.ocrText)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1 button-hover"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Kopyala</span>
                      </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 break-words font-mono">
                        {selectedDocument.ocrText}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedDocument.aiAnalysis && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Analizi
                      </h4>
                      <button
                        onClick={() => selectedDocument.aiAnalysis && navigator.clipboard.writeText(selectedDocument.aiAnalysis)}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center space-x-1 button-hover"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Kopyala</span>
                      </button>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {selectedDocument.aiAnalysis}
                      </div>
                    </div>
                  </div>
                )}

                {selectedDocument.operations && selectedDocument.operations.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        İşlem Geçmişi
                      </h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {selectedDocument.operations.length} işlem
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto custom-scrollbar space-y-3">
                      {selectedDocument.operations.map((operation) => (
                        <div key={operation.id} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-900">{operation.operation}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(operation.createdAt).toLocaleString('tr-TR', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOperationLevelColor(operation.level)}`}>
                                {getOperationLevelText(operation.level)}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(operation.status)}`}>
                                {getStatusBadgeText(operation.status)}
                              </span>
                            </div>
                          </div>
                          {operation.score && (
                            <div className="flex items-center space-x-1 mt-2">
                              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs font-medium text-yellow-600">Puan: {operation.score}/100</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!selectedDocument.ocrText && !selectedDocument.aiAnalysis && (!selectedDocument.operations || selectedDocument.operations.length === 0) && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      Bu belge için henüz analiz sonucu veya işlem geçmişi bulunmuyor.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1 button-hover"
                >
                  Kapat
                </button>
                {selectedDocument.status === 'completed' && (
                  <button 
                    onClick={() => {
                      const content = `Belge: ${selectedDocument.filename}\nTarih: ${formatDate(selectedDocument.uploadTime)}\nDurum: ${getStatusBadgeText(selectedDocument.status)}\n\nOCR Sonucu:\n${selectedDocument.ocrText || 'OCR metni bulunamadı'}\n\nAI Analizi:\n${selectedDocument.aiAnalysis || 'AI analizi bulunamadı'}\n\nPuan: ${selectedDocument.score || 'Puan yok'}/100`
                      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${selectedDocument.filename.replace(/\.[^/.]+$/, '')}_analiz.txt`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 order-1 sm:order-2 flex items-center space-x-2 button-hover"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707v11a2 2 0 01-2 2z" />
                    </svg>
                    <span>Sonucu İndir</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}