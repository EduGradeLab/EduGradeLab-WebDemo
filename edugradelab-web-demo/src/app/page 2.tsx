import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar showDemoButton={true} />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              🚀 Yapay Zeka Destekli Analiz
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Sınav Analizinde
            <span className="gradient-text block"> Yeni Nesil Çözüm</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sınav kağıtlarınızı saniyeler içinde tarayın, yapay zeka ile analiz edin 
            ve detaylı geri bildirim alın. Öğretmenler ve öğrenciler için tasarlanmış 
            modern, güvenli ve hızlı çözüm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/demologin">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto">
                🎯 Hemen Demo Dene
              </button>
            </Link>
            <Link href="#features">
              <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 transition-all duration-300 w-full sm:w-auto">
                📋 Özellikleri Keşfet
              </button>
            </Link>
          </div>
          <div className="mb-8">
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Demo için sadece reCAPTCHA doğrulaması gereklidir. Email opsiyoneldir.
            </p>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-500 text-sm ml-4">EduGradeLab Demo</span>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-blue-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              ✨ Güçlü Özellikler
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden EduGradeLab?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern teknoloji ile eğitimde devrim yaratan özellikler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Işık Hızında Tarama</h3>
              <p className="text-gray-600 leading-relaxed">
                En gelişmiş OCR teknolojisi ile sınav kağıtlarınızı saniyeler içinde dijital formata çevirin.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Akıllı yapay zeka Analizi</h3>
              <p className="text-gray-600 leading-relaxed">
                GPT-4 tabanlı yapay zeka ile cevapları analiz edin, puanları otomatik hesaplayın.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Detaylı Raporlar</h3>
              <p className="text-gray-600 leading-relaxed">
                Öğrenci performansını gösteren interaktif ve kapsamlı analiz raporları.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Gerçek Zamanlı</h3>
              <p className="text-gray-600 leading-relaxed">
                Anlık sonuçlar, gerçek zamanlı progress takibi ve hızlı geri bildirim.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Güvenli & Privat</h3>
              <p className="text-gray-600 leading-relaxed">
                End-to-end şifreleme ile verileriniz tamamen güvende. GDPR uyumlu.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Bulut Tabanlı</h3>
              <p className="text-gray-600 leading-relaxed">
                Her yerden erişim, otomatik yedekleme ve sınırsız depolama kapasitesi.
              </p>
            </div>
          </div>
        </div>

        {/* NEW: Social Learning Features */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              🌟 Sosyal Öğrenme Platformu
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sadece Değil, Sosyal Bir Öğrenme Deneyimi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Yapay zeka destekli analiz yanı sıra, sosyal etkileşim ve işbirliği özellikleriyle öğrenmeyi bir üst seviyeye taşıyın
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Feed Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-white">📰</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Feed & Duvar</h3>
                  <p className="text-gray-600">Facebook/LinkedIn tarzı sosyal akış</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">📢</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Duyurular & Paylaşımlar</h4>
                    <p className="text-gray-600 text-sm">Öğretmen duyuruları, başarı hikayeleri, etkinlikler</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Başarı Rozetleri</h4>
                    <p className="text-gray-600 text-sm">Öğrenci başarmlarını kutlayın ve motivasyonu artırın</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">yapay zeka Önerileri</h4>
                    <p className="text-gray-600 text-sm">Kişiselleştirilmiş içerik önerileri ve analizler</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Örnek Feed Gönderisi</span>
                  <span className="text-xs text-gray-500">2 dakika önce</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">🎉 Matematik sınavında sınıf ortalaması %85! Tebrikler everyone!</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>👍 24 beğeni</span>
                  <span>💬 8 yorum</span>
                  <span>📈 150 görüntülenme</span>
                </div>
              </div>

              <Link href="/demologin">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Feed&apos;i Keşfet →
                </button>
              </Link>
            </div>

            {/* Chat Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-white">💬</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Sohbet Kanalları</h3>
                  <p className="text-gray-600">Discord/Slack tarzı iletişim platformu</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🏫</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sınıf Kanalları</h4>
                    <p className="text-gray-600 text-sm">Her sınıf için özel iletişim kanalı</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">📚</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ders Odaları</h4>
                    <p className="text-gray-600 text-sm">Ders bazlı grup çalışması ve soru-cevap</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🏢</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Okul Genel</h4>
                    <p className="text-gray-600 text-sm">Tüm okul duyuruları ve genel sohbet</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium text-gray-700">10. Sınıf Matematik</span>
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                  </div>
                  <span className="text-xs text-gray-500">Aktif</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">👨‍🏫 Öğretmen: Yarınki sınav için çalışma grubu kuruldu...</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>👥 28 üye</span>
                  <span>💬 15 yeni mesaj</span>
                </div>
              </div>

              <Link href="/demologin">
                <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Sohbetlere Katıl →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-8">Platformumuzun Etkisi</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Aktif Öğrenci</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Öğretmen</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-blue-100">Analiz Edilmiş Sınav</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-blue-100">Memnuniyet Oranı</div>
              </div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div id="how-it-works" className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Yükle</h3>
              <p className="text-gray-600">
                Sınav kağıdınızı fotoğrafını çekin veya yükleyin.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Analiz Et</h3>
              <p className="text-gray-600">
                Yapay zeka otomatik olarak cevapları analiz etsin.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Rapor Al</h3>
              <p className="text-gray-600">
                Detaylı analiz raporunu anında görün.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 mb-20">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
              ❓ Sıkça Sorulan Sorular
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Merak Ettiğiniz Her Şey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              EduGradeLab hakkında en çok sorulan sorular ve cevapları
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      EduGradeLab tam olarak nedir ve nasıl çalışır?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      EduGradeLab, yapay zeka destekli bir sınav analiz platformudur. Sınav kağıtlarınızı fotoğrafını çekerek yüklersiniz,
                      gelişmiş OCR teknolojisi metni çıkarır, GPT-4 tabanlı yapay zeka cevapları analiz eder ve size detaylı raporlar sunar.
                      Ayrıca feed ve sohbet özellikleriyle sosyal öğrenme deneyimi yaşarsınız.
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Güvenlik ve gizlilik nasıl sağlanıyor?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Tüm verileriniz end-to-end şifreleme ile korunur. GDPR uyumlu çalışırız, fotoğraflarınız analiz edildikten sonra
                      otomatik olarak silinir ve hiçbir kişisel veriniz üçüncü kişilerle paylaşılmaz. Demo modunda ise hiçbir veri kaydedilmez.
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🔒</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Feed ve sohbet özellikleri nasıl kullanılıyor?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Feed bölümünde öğretmen duyuruları, öğrenci başarıları, etkinlikler ve yapay zeka önerilerini görürsünüz.
                      Sohbet kanallarında sınıf arkadaşlarınızla ve öğretmenlerinizle dersler hakkında konuşabilir,
                      çalışma grupları oluşturabilir ve sorularınızı paylaşabilirsiniz.
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">💬</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ 4 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Demo sürümünde neler yapabilirim?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Demo sürümünde tüm özellikleri test edebilirsiniz: OCR tarama, yapay zeka analizi, detaylı raporlar,
                      feed paylaşımları, sohbet kanalları ve rol bazlı paneller (öğrenci, öğretmen, admin).
                      Demo için sadece reCAPTCHA doğrulaması yeterlidir, email gerektirmez.
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🎯</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ 5 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Hangi cihazları destekliyorsunuz?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      EduGradeLab tüm modern cihazlarda çalışır: Windows, Mac, Linux bilgisayarlar, iOS ve Android
                      mobil cihazlar. Responsive tasarım sayesinde her ekran boyutunda mükemmel deneyim sunar.
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ 6 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Fiyatlandırma nasıl işliyor?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Şu anda demo tamamen ücretsizdir. Gelecekte okul bazında uygun fiyatlı abonelik modelleri
                      planlıyoruz. Öğretmenler ve öğrenciler için her zaman erişilebilir olmayı hedefliyoruz.
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">💰</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-32 mb-20">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium mb-4">
              💬 Kullanıcı Yorumları
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Kullanıcılarımız Ne Diyor?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              EduGradeLab&apos;i deneyimleyen öğretmen ve öğrencilerin görüşleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">👩‍🏫</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Ayşe Yılmaz</h4>
                  <p className="text-sm text-gray-600">Matematik Öğretmeni</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-gray-600">
                &ldquo;EduGradeLab sayesinde sınav kağıtlarını değerlendirme sürecim 10 kat hızlandı. Feed özelliğiyle öğrencilerle daha iyi iletişim kuruyorum.&rdquo;
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">👨‍🎓</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mehmet Demir</h4>
                  <p className="text-sm text-gray-600">Lise Öğrencisi</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-gray-600">
                &ldquo;Sohbet kanallarında arkadaşlarımla çalışmak çok kolaylaştı. yapay zeka analizleri sayesinde zayıf olduğum konuları anında görüyorum.&rdquo;
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">👩‍💼</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Zeynep Kaya</h4>
                  <p className="text-sm text-gray-600">Okul Müdürü</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-gray-600">
                &ldquo;Okulumuzda EduGradeLab&apos;i kullanmaya başladığımızdan beri hem öğretmenler hem öğrenciler çok memnun. Admin paneli çok kullanışlı.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-20 mb-20">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-90"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Eğitimi Birlikte Dönüştürelim
                </h2>
                <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                  Yapay zeka destekli sınav analizi ve sosyal öğrenme platformumuzla tanışın.
                  Ücretsiz demo ile sınırsız keşfedin!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Link href="/demologin">
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      🚀 Hemen Demo Başlat
                    </button>
                  </Link>
                  <Link href="/features">
                    <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300">
                      📋 Tüm Özellikler
                    </button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl mb-2">⏱️</div>
                    <div className="font-semibold">Hızlı Kurulum</div>
                    <div className="text-sm opacity-75">5 dakikada başlayın</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="font-semibold">Kolay Kullanım</div>
                    <div className="text-sm opacity-75">Eğitim gerektirmez</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <div className="font-semibold">Anlık Sonuçlar</div>
                    <div className="text-sm opacity-75">Saniyeler içinde analiz</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Trust Section */}
        <div className="mt-20 mb-20">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Güven ve Kalite Standartlarımız
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🔒</div>
                <div className="font-semibold text-gray-900">Güvenli</div>
                <div className="text-sm text-gray-600">End-to-end şifreleme</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <div className="font-semibold text-gray-900">Hızlı</div>
                <div className="text-sm text-gray-600">Saniyeler içinde sonuç</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌍</div>
                <div className="font-semibold text-gray-900">Erişilebilir</div>
                <div className="text-sm text-gray-600">Her cihazda çalışır</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🎓</div>
                <div className="font-semibold text-gray-900">Profesyonel</div>
                <div className="text-sm text-gray-600">Eğitimciler için tasarlandı</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EG</span>
                </div>
                <h3 className="text-xl font-bold">EduGradeLab</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Yapay zeka destekli sınav analizi ve sosyal öğrenme platformu
              </p>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold mb-4">Özellikler</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">yapay zeka Analizi</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Feed & Duvar</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Sohbet Kanalları</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Güvenlik</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Kurumsal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Hakkımızda</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">İletişim</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold mb-4">Bağlantı</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/demologin" className="hover:text-white transition-colors">Demo Başlat</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Özellikler</Link></li>
                <li><Link href="/document" className="hover:text-white transition-colors">Belgeler</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Destek</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 EduGradeLab. Tüm hakları saklıdır.
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <span>🔒 Güvenli Ödeme</span>
                <span>🌍 Türkiye</span>
                <span>📧 info@edugradelab.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}