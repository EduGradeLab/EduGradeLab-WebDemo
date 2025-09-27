'use client'

export default function SocialLearningSection() {
  const features = [
    {
      title: "Feed Akışı",
      description: "Öğretmen duyuruları, öğrenci başarıları, etkinlikler ve Yapay Zeka önerilerini tek bir yerden takip edin.",
      icon: "📱",
      color: "blue"
    },
    {
      title: "Sohbet Kanalları",
      description: "Sınıf arkadaşlarınızla ve öğretmenlerinizle dersler hakkında konuşun, çalışma grupları oluşturun.",
      icon: "💬",
      color: "purple"
    },
    {
      title: "Yapay Zeka Önerileri",
      description: "Yapay zeka destekli kişiselleştirilmiş öğrenme önerileri ve içerik önerileri.",
      icon: "🤖",
      color: "green"
    },
    {
      title: "Koleksiyonlar",
      description: "Öğrenme materyallerinizi düzenleyin, paylaşın ve toplulukla birlikte çalışın.",
      icon: "📚",
      color: "orange"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-medium mb-4">
            🌐 Sosyal Öğrenme
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Birlikte Daha Fazla Öğrenin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sosyal öğrenme özelliklerimizle eğitim deneyimini zenginleştirin ve toplulukla bağlantı kurun.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  feature.color === 'blue' ? 'bg-blue-100' :
                  feature.color === 'purple' ? 'bg-purple-100' :
                  feature.color === 'green' ? 'bg-green-100' :
                  feature.color === 'orange' ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Visual Demo */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>

            {/* Mock Interface */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🎓</span>
                    </div>
                    <span className="text-white font-semibold">EduGradeLab Sınıf</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white text-sm">Çevrimiçi</span>
                  </div>
                </div>
              </div>

              {/* Feed Content */}
              <div className="p-6 space-y-4">
                {/* Post 1 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">👩‍🏫</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Ayşe Öğretmen</h4>
                      <p className="text-xs text-gray-500">2 saat önce</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    📢 Yarın saat 14:00&apos;te matematik sınavımız var. Herkes hazır olsun! 📚✨
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>👍 12</span>
                    <span>💬 5</span>
                  </div>
                </div>

                {/* Post 2 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">👨‍🎓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Mehmet</h4>
                      <p className="text-xs text-gray-500">5 saat önce</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    🎉 Geometri sınavından 95 aldım! Yapay Zeka analizi sayesinde zayıf olduğum konuları hedefledim. Teşekkürler! 🙏
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>👍 24</span>
                    <span>💬 8</span>
                  </div>
                </div>

                {/* Chat Preview */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-purple-600">💬</span>
                    <h4 className="font-semibold text-purple-900 text-sm">Çalışma Grubu</h4>
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">8 üye</span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Son mesaj: &quot;Hafta sonu fizik çalışması yapıyor musunuz?&quot; - Zeynep
                  </p>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex justify-around">
                  <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <span className="text-lg">🏠</span>
                    <span className="text-xs">Ana Sayfa</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <span className="text-lg">📚</span>
                    <span className="text-xs">Dersler</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-blue-600">
                    <span className="text-lg">💬</span>
                    <span className="text-xs">Sohbet</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <span className="text-lg">👤</span>
                    <span className="text-xs">Profil</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Topluluğumuza Katılın
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Binlerce öğretmen ve öğrencinin yer aldığı EduGradeLab topluluğunda siz de yerinizi alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/demologin" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Hemen Katıl
              </a>
              <a href="/features" className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
                Daha Fazla Öğren
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}