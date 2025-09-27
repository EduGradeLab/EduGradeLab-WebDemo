import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function PricingPage() {
  const pricingPlans = [
    {
      name: 'Starter',
      price: '199',
      period: 'aylık',
      description: 'Küçük okullar ve özel ders verenler için ideal',
      features: [
        'Aylık 100 sınav analizi',
        'Temel OCR ve AI değerlendirme',
        'Standart raporlama',
        'E-posta desteği',
        '1 kullanıcı hesabı'
      ],
      cta: 'Başla',
      popular: false,
      color: 'from-gray-600 to-gray-700'
    },
    {
      name: 'Professional',
      price: '499',
      period: 'aylık',
      description: 'Orta ölçekli eğitim kurumları için',
      features: [
        'Aylık 500 sınav analizi',
        'Gelişmiş OCR ve AI değerlendirme',
        'Detaylı analitik ve raporlama',
        'Öncelikli teknik destek',
        '5 kullanıcı hesabı',
        'Özel Müfredat entegrasyonu',
        'Performans takip paneli'
      ],
      cta: 'En Popüler',
      popular: true,
      color: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Enterprise',
      price: 'Özel',
      period: '',
      description: 'Büyük eğitim kurumları ve zincirler için',
      features: [
        'Sınırsız sınav analizi',
        'Premium OCR ve AI değerlendirme',
        'Özel raporlama ve dashboard',
        '7/24 dedicated destek',
        'Sınırsız kullanıcı',
        'API erişimi',
        'Entegre yönetim paneli',
        'Eğitim danışmanlığı'
      ],
      cta: 'İletişime Geç',
      popular: false,
      color: 'from-purple-600 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar showDemoButton={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Fiyatlandırma</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Eğitim kurumunuzun büyüklüğüne uygun en doğru çözümü seçin
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 font-medium">
              💡 Tüm planlarımız 14 gün ücretsiz deneme süresi içerir
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    En Popüler
                  </span>
                </div>
              )}

              <div className={`h-2 bg-gradient-to-r ${plan.color} rounded-t-2xl`}></div>

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    {plan.price === 'Özel' ? (
                      <span className="text-3xl font-bold text-gray-900">Özel Fiyat</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900">₺{plan.price}</span>
                        <span className="text-gray-600 ml-2">/{plan.period}</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.price === 'Özel' ? '/contact' : '/demologin'}
                  className={`w-full block text-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ek Hizmetler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Eğitim Danışmanlığı</h3>
              <p className="text-gray-600">Uzman eğitim danışmanlarımızla sınav analizi ve öğrenci performansı hakkında detaylı görüşmeler</p>
              <p className="text-blue-600 font-medium mt-2">₺500/saat</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Özel Entegrasyon</h3>
              <p className="text-gray-600">Mevcut eğitim yönetim sistemlerinizle entegrasyon ve özel API geliştirme hizmetleri</p>
              <p className="text-blue-600 font-medium mt-2">Projeye özel</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </main>
    </div>
  )
}