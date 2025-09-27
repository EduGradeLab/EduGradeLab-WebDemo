'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  return (
    <main id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 scroll-mt-24">
      <div className="text-center">
        {/* Badge */}
        <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium mb-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          🚀 Yeni Nesil Eğitim Teknolojisi
        </div>

        {/* Main Heading */}
        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight transition-all duration-1000 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="block">Kendi Yapay Zekamızla</span>
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-300% animate-gradient">
            Sınav Analizi
          </span>
        </h1>

        {/* Description */}
        <p className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Kendi Yapay Zeka ve OCR teknolojimizle Türkçe eğitim materyallerini saniyeler içinde analiz edin.
          MEB uyumlu, yerel ve güvenli çözüm.
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 delay-600 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link href="/demologin">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              🚀 Hemen Demo Başlat
            </button>
          </Link>
          <Link href="/features">
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105 transform">
              📋 Özellikleri İncele
            </button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-800 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300 group">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-blue-200">
              <span className="text-blue-600">🇹🇷</span>
            </div>
            <span className="text-gray-700 font-medium group-hover:text-blue-800 transition-colors">Yerel Veri Merkezi</span>
          </div>
          <div className="flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300 group">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-green-200">
              <span className="text-green-600">✓</span>
            </div>
            <span className="text-gray-700 font-medium group-hover:text-green-800 transition-colors">MEB Uyumlu</span>
          </div>
          <div className="flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300 group">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-purple-200">
              <span className="text-purple-600">🔒</span>
            </div>
            <span className="text-gray-700 font-medium group-hover:text-purple-800 transition-colors">KVKK & GDPR</span>
          </div>
        </div>
      </div>

      {/* Visual Elements */}
      <div className={`mt-20 relative transition-all duration-1000 delay-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl blur-3xl opacity-30"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">📄</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">OCR Tarama</h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">Türkçe metinleri %99 doğrulukla çıkarır</p>
            </div>
            <div className="group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2 transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">🧠</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Yapay Zeka Analizi</h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">MEB müfredatına uygun değerlendirme</p>
            </div>
            <div className="group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Detaylı Rapor</h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">Anlık ve kapsamlı sonuçlar</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}