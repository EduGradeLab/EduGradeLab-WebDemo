'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import FeaturesSection from '@/components/FeaturesSection'
import SocialLearningSection from '@/components/SocialLearningSection'
import ContactSection from '@/components/ContactSection'
import { useNotification, NotificationContainer } from '@/components/NotificationSystem'

export default function Home() {
  const { notifications, removeNotification } = useNotification()

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  const faqData = [
    {
      id: 'ai-ocr',
      category: 'technology',
      icon: '🧠',
      iconColor: 'blue',
      question: 'Kendi Yapay Zeka ve OCR teknolojiniz nasıl çalışıyor?',
      answer: 'EduGradeLab, tamamen kendi geliştirdiğimiz yerel Yapay Zeka ve OCR teknolojisini kullanır. Türkçe eğitim materyalleri için özel eğitilmiş OCR motorumuz metinleri %99 doğrulukla çıkarır, kendi yapay zeka modelimiz ise MEB müfredatına uygun olarak cevapları analiz eder. Hiçbir dış bağımlılığı yoktur.'
    },
    {
      id: 'data-security',
      category: 'security',
      icon: '🇹🇷',
      iconColor: 'green',
      question: 'Verilerim nerede saklanıyor ve nasıl korunuyor?',
      answer: 'Tüm verileriniz Türkiye\'deki yerel veri merkezlerimizde saklanır. KVKK ve GDPR uyumlu çalışırız, end-to-end şifreleme ile korunur. Hiçbir veriniz yurt dışına aktarılmaz ve analizlerden sonra otomatik olarak silinir. Demo modunda hiçbir veri kaydedilmez.'
    },
    {
      id: 'feed-chat',
      category: 'features',
      icon: '💬',
      iconColor: 'purple',
      question: 'Feed ve sohbet özellikleri nasıl kullanılıyor?',
      answer: 'Feed bölümünde öğretmen duyuruları, öğrenci başarıları, etkinlikler ve Yapay Zeka önerilerini görürsünüz. Sohbet kanallarında sınıf arkadaşlarınızla ve öğretmenlerinizle dersler hakkında konuşabilir, çalışma grupları oluşturabilir ve sorularınızı paylaşabilirsiniz.'
    },
    {
      id: 'demo-features',
      category: 'features',
      icon: '🎯',
      iconColor: 'orange',
      question: 'Demo sürümünde neler yapabilirim?',
      answer: 'Demo sürümünde tüm özellikleri test edebilirsiniz: OCR tarama, yapay zeka analizi, detaylı raporlar, feed paylaşımları, sohbet kanalları ve rol bazlı paneller (öğrenci, öğretmen, admin). Demo için sadece reCAPTCHA doğrulaması yeterlidir, email gerektirmez.'
    },
    {
      id: 'meb-compliance',
      category: 'technology',
      icon: '📚',
      iconColor: 'red',
      question: 'Yapay Zeka modeliniz MEB müfredatına ne kadar uyumlu?',
      answer: 'Yapay Zeka modellerimiz MEB müfredatına özel olarak eğitilmiştir. Tüm derslerde, konularda ve sınav formatlarında yüksek başarı oranı sunar. Sürekli olarak güncellenir ve müfredat değişikliklerine anında adapte olur.'
    },
    {
      id: 'tech-advantages',
      category: 'technology',
      icon: '⚡',
      iconColor: 'yellow',
      question: 'Teknoloji avantajlarınız nelerdir?',
      answer: 'Kendi teknolojimiz sayesinde: Dış bağımlılık yoktur, veriler Türkiye\'de kalır, Türkçe\'de %99 doğruluk, MEB uyumlu, sürekli geliştirme, yerel destek ve özel eğitim materyalleri için optimize edilmiş çalışma.'
    }
  ]

  const categories = [
    { id: 'all', name: 'Tümü', icon: '📋' },
    { id: 'technology', name: 'Teknoloji', icon: '🔬' },
    { id: 'security', name: 'Güvenlik', icon: '🔒' },
    { id: 'features', name: 'Özellikler', icon: '✨' }
  ]

  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Social Learning Section */}
      <SocialLearningSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Modern FAQ Section */}
      <div className="mt-32 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
              ❓ Teknolojimiz Hakkında
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kendi Yapay Zeka ve OCR teknolojimiz hakkında merak edilenler
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Search and Filter Section */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Sorular arasında ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Sonuç bulunamadı</h3>
                  <p className="text-gray-500">Arama kriterlerinize uygun soru bulunamadı.</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
                      openFaq === faq.id
                        ? 'border-blue-300 shadow-xl ring-2 ring-blue-100'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          faq.iconColor === 'blue' ? 'bg-blue-100' :
                          faq.iconColor === 'green' ? 'bg-green-100' :
                          faq.iconColor === 'purple' ? 'bg-purple-100' :
                          faq.iconColor === 'orange' ? 'bg-orange-100' :
                          faq.iconColor === 'red' ? 'bg-red-100' :
                          faq.iconColor === 'yellow' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          <span className="text-xl">{faq.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                          openFaq === faq.id ? 'bg-blue-100 rotate-180' : 'bg-gray-100'
                        }`}>
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-4">
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Results Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {filteredFaqs.length} soru gösteriliyor
                {searchTerm && ` "${searchTerm}" için`}
                {activeCategory !== 'all' && ` (${categories.find(c => c.id === activeCategory)?.name} kategorisinde)`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="hakkimizda" className="scroll-mt-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              🏢 Hakkımızda
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              EduGradeLab Hikayemiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Eğitimde dijital dönüşümü hızlandırmak için yola çıktık
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Vizyonumuz</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                EduGradeLab olarak, eğitim teknolojilerinde çığır açmayı hedefliyoruz. Öğretmenlerin ve öğrencilerin hayatını kolaylaştıran, yerel ve güvenli çözümler geliştiriyoruz.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                2023 yılında kurulan şirketimiz, kısa sürede Türkiye&apos;nin önde gelen eğitim teknolojileri sağlayıcılarından biri haline geldi.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Yerel Teknoloji</h4>
                    <p className="text-gray-600 text-sm">Tamamen yerli ve milli Yapay Zeka çözümleri</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-green-600">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Küresel Vizyon</h4>
                    <p className="text-gray-600 text-sm">Türkiye&apos;den dünyaya açılan teknoloji</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-purple-600">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">İnovasyon</h4>
                    <p className="text-gray-600 text-sm">Sürekli gelişen ve yenilikçi yaklaşım</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Bize Ulaşın</h3>
                <p className="text-gray-600">Soru, öneri veya iş birliği için bizimle iletişime geçin</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600">📧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">E-posta</h4>
                    <p className="text-gray-600">info@edugradelab.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-green-600">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Telefon</h4>
                    <p className="text-gray-600">+90 850 123 45 67</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-purple-600">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Adres</h4>
                    <p className="text-gray-600">İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link href="/demologin" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Demo Talebi Gönder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">EG</span>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    EduGradeLab
                  </h3>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  Kendi Yapay Zeka ve OCR teknolojimizle Türkçe eğitim materyallerini analiz edin. MEB uyumlu, yerel ve güvenli çözüm.
                </p>

                {/* Newsletter */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Bültene Abone Ol</h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                    />
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                      Abone Ol
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="text-xl">📧</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="text-xl">💼</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="text-xl">🐦</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="text-xl">📱</span>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Özellikler</a></li>
                  <li><a href="#nasıl-calisir" className="text-gray-300 hover:text-white transition-colors">Nasıl Çalışır</a></li>
                  <li><a href="#hakkimizda" className="text-gray-300 hover:text-white transition-colors">Hakkımızda</a></li>
                  <li><a href="#iletisim" className="text-gray-300 hover:text-white transition-colors">İletişim</a></li>
                  <li><a href="/demologin" className="text-gray-300 hover:text-white transition-colors">Demo</a></li>
                  <li><a href="/features" className="text-gray-300 hover:text-white transition-colors">Tüm Özellikler</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Yasal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gizlilik Politikası</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Kullanım Koşulları</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Çerez Politikası</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">KVKK Aydınlatma</a></li>
                </ul>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-xl">🇹🇷</span>
                  <span>Yerli Teknoloji</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-xl">🔒</span>
                  <span>KVKK Uyumlu</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-xl">🎓</span>
                  <span>MEB Onaylı</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-xl">🛡️</span>
                  <span>Güvenli Altyapı</span>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left">
                  <p className="text-gray-400">
                    © 2024 EduGradeLab. Tüm hakları saklıdır.
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Türkiye&apos;de geliştirildi ❤️
                  </p>
                </div>

                {/* Bottom Links */}
                <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-4 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Sitemap</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">API</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Status</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Docs</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Notification Container */}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </>
  )
}