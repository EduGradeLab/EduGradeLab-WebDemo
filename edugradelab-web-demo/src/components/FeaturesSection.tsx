'use client'

import { useEffect, useState } from 'react'

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('features')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])
  const features = [
    {
      title: "Yapay Zeka Analizi",
      description: "Kendi Yapay Zeka teknolojimizle sınavları otomatik analiz edin, puanlayın ve detaylı raporlar oluşturun.",
      icon: "🧠",
      color: "blue",
      featured: true
    },
    {
      title: "Türkçe OCR",
      description: "Türkçe eğitim materyalleri için özel geliştirilmiş %99 doğruluklu metin çıkarma teknolojisi.",
      icon: "📄",
      color: "green"
    },
    {
      title: "MEB Uyumlu",
      description: "Milli Eğitim Bakanlığı müfredatına tam uyumlu analiz ve değerlendirme sistemi.",
      icon: "🎓",
      color: "purple"
    },
    {
      title: "Sosyal Öğrenme",
      description: "Feed ve sohbet özellikleriyle öğrenciler ve öğretmenler arasında etkileşimli öğrenme.",
      icon: "💬",
      color: "orange"
    },
    {
      title: "Detaylı Raporlar",
      description: "Anlık ve kapsamlı analiz raporlarıyla öğrenci performansını detaylı takip edin.",
      icon: "📊",
      color: "red"
    },
    {
      title: "Yerel Veri",
      description: "Tüm verileriniz Türkiye'deki sunucularımızda güvenle saklanır, KVKK ve GDPR uyumludur.",
      icon: "🇹🇷",
      color: "yellow"
    }
  ]

  return (
    <section id="features" className="scroll-mt-24 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium mb-4">
            ✨ Özellikler
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Eğitimi Dönüştüren Özellikler
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Yapay zeka destekli platformumuzla eğitim sürecinizi bir üst seviyeye taşıyın.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden ${
                feature.featured
                  ? 'border-blue-300 ring-2 ring-blue-100 hover:ring-blue-200'
                  : 'border-gray-100 hover:border-gray-300'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Featured Badge */}
              {feature.featured && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
                    ⭐ EN POPÜLER
                  </span>
                </div>
              )}

              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                feature.color === 'blue' ? 'bg-blue-100 hover:bg-blue-200' :
                feature.color === 'green' ? 'bg-green-100 hover:bg-green-200' :
                feature.color === 'purple' ? 'bg-purple-100 hover:bg-purple-200' :
                feature.color === 'orange' ? 'bg-orange-100 hover:bg-orange-200' :
                feature.color === 'red' ? 'bg-red-100 hover:bg-red-200' :
                feature.color === 'yellow' ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <span className="text-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">{feature.icon}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features Preview */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Daha Fazla Özellik Keşfedin</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Toplam 20+ özellik ile eğitim değerlendirme sürecinizi baştan sona otomatikleştirin.
            Word entegrasyonu, mobil uygulama, işbirliği araçları ve daha fazlası...
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/features" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Tüm Özellikleri Görüntüle
            </a>
            <a href="/demologin" className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Demo ile Deneyimle
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}