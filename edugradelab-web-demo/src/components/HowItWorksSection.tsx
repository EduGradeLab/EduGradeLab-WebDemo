'use client'

import { useEffect, useState } from 'react'

export default function HowItWorksSection() {
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

    const element = document.getElementById('nasıl-calisir')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])
  const steps = [
    {
      step: "01",
      title: "Sınav Kağıdını Yükle",
      description: "Sınav kağıdınızı tarayın veya fotoğrafını çekin. Sistemimiz otomatik olarak algılar ve işler.",
      icon: "📤",
      color: "blue"
    },
    {
      step: "02",
      title: "Yapay Zeka Metin Çıkarımı",
      description: "Kendi OCR teknolojimizle Türkçe metinleri %99 doğrulukla dijital formata çevirir.",
      icon: "🧠",
      color: "purple"
    },
    {
      step: "03",
      title: "Yapay Zeka Analizi",
      description: "Yapay zeka modelimiz MEB müfredatına uygun olarak cevapları analiz eder ve puanlar.",
      icon: "📊",
      color: "green"
    },
    {
      step: "04",
      title: "Detaylı Rapor",
      description: "Kapsamlı analiz raporuyla öğrenci performansını detaylı şekilde inceleyin.",
      icon: "📈",
      color: "orange"
    }
  ]

  return (
    <section id="nasıl-calisir" className="scroll-mt-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-4 badge-primary">
            🔄 Nasıl Çalışır?
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 heading-section">
            4 Adımda Sınav Analizi
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto body-large">
            Karmaşık süreçleri basitleştiriyoruz. Sınav analizimiz sadece 4 adımda tamamlanır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 200}ms` }}>
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className={`hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform translate-x-4 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}></div>
              )}

              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full hover:scale-105 transform cursor-pointer">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto transition-all duration-300 ${
                  step.color === 'blue' ? 'bg-blue-100 hover:bg-blue-200' :
                  step.color === 'purple' ? 'bg-purple-100 hover:bg-purple-200' :
                  step.color === 'green' ? 'bg-green-100 hover:bg-green-200' :
                  step.color === 'orange' ? 'bg-orange-100 hover:bg-orange-200' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  <span className="text-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">{step.icon}</span>
                </div>

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold mb-4 transition-all duration-300 ${
                    step.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                    step.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                    step.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                    step.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}>
                    {step.step}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 heading-card group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed body-regular group-hover:text-gray-800 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className={`mt-20 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 heading-small group-hover:text-blue-600 transition-colors">Hızlı Sonuç</h3>
              <p className="text-gray-600 body-regular group-hover:text-gray-800 transition-colors">Saniyeler içinde tamamlanan analiz</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 heading-small group-hover:text-purple-600 transition-colors">Yüksek Doğruluk</h3>
              <p className="text-gray-600 body-regular group-hover:text-gray-800 transition-colors">%99 oranında başarılı metin çıkarma</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">🛡️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 heading-small group-hover:text-green-600 transition-colors">Güvenli</h3>
              <p className="text-gray-600 body-regular group-hover:text-gray-800 transition-colors">Verileriniz Türkiye&apos;de kalır</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}