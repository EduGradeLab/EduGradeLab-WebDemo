'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  status: 'available' | 'beta' | 'coming-soon'
  details: string[]
  category: string
}

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)

  const features: Feature[] = [
    {
      id: 'ocr',
      title: 'Gelişmiş OCR',
      description: 'Yüksek doğruluklu optik karakter tanıma',
      icon: '🔍',
      status: 'available',
      details: [
        'Çoklu dil desteği (Türkçe, İngilizce)',
        'El yazısı tanıma',
        'Form yapıları otomatik algılama',
        '99%+ doğruluk oranı'
      ],
      category: 'core'
    },
    {
      id: 'ai-analysis',
      title: 'AI Analizi',
      description: 'Yapay zeka destekli cevap analizi',
      icon: '🧠',
      status: 'available',
      details: [
        'Otomatik cevap anahtarı eşleştirme',
        'Kısmi puanlama desteği',
        'Hata analizi ve geri bildirim',
        'Öğrenci performans raporları'
      ],
      category: 'core'
    },
    {
      id: 'real-time',
      title: 'Gerçek Zamanlı İşlem',
      description: 'Anlık sonuçlar ve işlem takibi',
      icon: '⚡',
      status: 'available',
      details: [
        'Saniyeler içinde sonuç',
        'Canlı işlem durumu',
        'Push bildirimler',
        'İşlem geçmişi'
      ],
      category: 'core'
    },
    {
      id: 'batch-processing',
      title: 'Toplu İşlem',
      description: 'Birden fazla sınavı aynı anda analiz et',
      icon: '📦',
      status: 'beta',
      details: [
        '100+ dosya aynı anda',
        'Otomatik kuyruk yönetimi',
        'Toplu raporlama',
        'İşlem önceliği ayarlama'
      ],
      category: 'advanced'
    },
    {
      id: 'voice-assistant',
      title: 'Sesli Asistan',
      description: 'Sesli komutlarla sınav yönetimi',
      icon: '🎤',
      status: 'coming-soon',
      details: [
        'Sesli komut tanıma',
        'Sesli geri bildirim',
        'Çoklu dil desteği',
        'Özelleştirilebilir komutlar'
      ],
      category: 'advanced'
    },
    {
      id: 'handwriting-recognition',
      title: 'El Yazısı Tanıma',
      description: 'Gelişmiş el yazısı analizi',
      icon: '✍️',
      status: 'beta',
      details: [
        'Farklı yazı stilleri',
        'Düzeltme işaretleri tanıma',
        'Matematiksel semboller',
        'Çizimler ve grafikler'
      ],
      category: 'advanced'
    },
    {
      id: 'api-integration',
      title: 'API Entegrasyonu',
      description: 'Harici sistemlerle entegrasyon',
      icon: '🔌',
      status: 'beta',
      details: [
        'RESTful API',
        'Webhook desteği',
        'SDK\'lar',
        'Özelleştirilebilir entegrasyonlar'
      ],
      category: 'integration'
    },
    {
      id: 'lms-integration',
      title: 'LMS Entegrasyonu',
      description: 'Öğrenme yönetim sistemleri ile bağlantı',
      icon: '🎓',
      status: 'coming-soon',
      details: [
        'Moodle entegrasyonu',
        'Google Classroom',
        'Microsoft Teams',
        'Özelleştirilebilir bağlantılar'
      ],
      category: 'integration'
    },
    {
      id: 'analytics-dashboard',
      title: 'Analitik Panel',
      description: 'Detaylı istatistikler ve raporlar',
      icon: '📊',
      status: 'beta',
      details: [
        'Görsel raporlar',
        'Trend analizi',
        'Öğrenci performansı',
        'Ders bazında istatistikler'
      ],
      category: 'analytics'
    },
    {
      id: 'export-options',
      title: 'Çeşitli Dışa Aktarma',
      description: 'Farklı formatlarda sonuç dışa aktarma',
      icon: '📤',
      status: 'available',
      details: [
        'PDF, Excel, CSV formatları',
        'Özelleştirilebilir şablonlar',
        'Toplu dışa aktarma',
        'Otomatik raporlama'
      ],
      category: 'export'
    },
    {
      id: 'collaboration',
      title: 'İşbirliği Araçları',
      description: 'Öğretmenler arasında işbirliği',
      icon: '👥',
      status: 'coming-soon',
      details: [
        'Paylaşılan çalışma alanları',
        'Gerçek zamanlı işbirliği',
        'Yorum ve geri bildirim',
        'İzin yönetimi'
      ],
      category: 'collaboration'
    },
    {
      id: 'mobile-app',
      title: 'Mobil Uygulama',
      description: 'iOS ve Android için mobil uygulama',
      icon: '📱',
      status: 'coming-soon',
      details: [
        'Çevrimdışı çalışma',
        'Anında bildirimler',
        'Mobil tarama',
        'Senkronizasyon'
      ],
      category: 'mobile'
    }
  ]

  const categories = [
    { id: 'all', name: 'Tümü', count: features.length },
    { id: 'core', name: 'Çekirdek', count: features.filter(f => f.category === 'core').length },
    { id: 'advanced', name: 'Gelişmiş', count: features.filter(f => f.category === 'advanced').length },
    { id: 'integration', name: 'Entegrasyon', count: features.filter(f => f.category === 'integration').length },
    { id: 'analytics', name: 'Analitik', count: features.filter(f => f.category === 'analytics').length },
    { id: 'export', name: 'Dışa Aktarma', count: features.filter(f => f.category === 'export').length },
    { id: 'collaboration', name: 'İşbirliği', count: features.filter(f => f.category === 'collaboration').length },
    { id: 'mobile', name: 'Mobil', count: features.filter(f => f.category === 'mobile').length }
  ]

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50'
      case 'beta': return 'text-yellow-600 bg-yellow-50'
      case 'coming-soon': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Mevcut'
      case 'beta': return 'Beta'
      case 'coming-soon': return 'Yakında'
      default: return status
    }
  }

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.name : category
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="features" />
      
      <div className="lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Özellikler
            </h1>
            <p className="text-gray-600">
              EduGradeLab&apos;in sunduğu tüm özellikler ve geliştirmeler
            </p>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {category.name}
                  <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedFeature(feature)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(feature.status)}`}>
                    {getStatusText(feature.status)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {getCategoryName(feature.category)}
                  </span>
                </div>

                <div className="space-y-2">
                  {feature.details.slice(0, 3).map((detail, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
                    </div>
                  ))}
                  {feature.details.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{feature.details.length - 3} daha fazla...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Detail Modal */}
          {selectedFeature && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{selectedFeature.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedFeature.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {selectedFeature.description}
                        </p>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedFeature.status)}`}>
                            {getStatusText(selectedFeature.status)}
                          </span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                            {getCategoryName(selectedFeature.category)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFeature(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Özellik Detayları</h4>
                    <div className="space-y-3">
                      {selectedFeature.details.map((detail, index) => (
                        <div key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Kapat
                      </button>
                      {selectedFeature.status === 'available' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Hemen Dene
                        </button>
                      )}
                      {selectedFeature.status === 'beta' && (
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                          Beta Testi
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}