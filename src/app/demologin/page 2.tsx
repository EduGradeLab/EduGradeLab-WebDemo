'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

export default function DemoLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // reCAPTCHA yüklendiğinde
    if (typeof window !== 'undefined' && window.grecaptcha) {
      setRecaptchaLoaded(true)
    }
  }, [])

  const handleDemoLogin = async () => {
    if (!recaptchaLoaded) {
      alert('Lütfen bekleyin, güvenlik kontrolü yükleniyor...')
      return
    }

    setIsLoading(true)
    
    try {
      // reCAPTCHA v3 token al
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: 'demo_login' }
      )

      // Token'ı backend'e gönder ve doğrula
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        // Başarılı ise demo home sayfasına yönlendir
        router.push('/demohome')
      } else {
        throw new Error('Güvenlik doğrulaması başarısız')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !name) {
      alert('Lütfen tüm alanları doldurun.')
      return
    }

    try {
      const response = await fetch('/api/demo-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      if (response.ok) {
        alert('E-posta adresiniz başarıyla kaydedildi!')
        setShowEmailModal(false)
        setEmail('')
        setName('')
      } else {
        throw new Error('E-posta kaydedilemedi')
      }
    } catch (error) {
      console.error('Email save error:', error)
      alert('E-posta kaydedilirken bir hata oluştu.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* reCAPTCHA Script */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        onLoad={() => setRecaptchaLoaded(true)}
      />

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            EduGradeLab
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Yapay Zeka Destekli Sınav Analizi
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Demo Deneyimi
            </h2>
            <p className="text-gray-600">
              AI destekli sınav analizimizi hemen deneyin
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Yükleniyor...' : 'Demo Başlat'}
            </button>

            <button
              onClick={() => setShowEmailModal(true)}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              İletişim Bilgilerini Kaydet
            </button>

            <a
              href="/"
              className="w-full block text-center text-gray-500 hover:text-gray-700 py-2"
            >
              Ana Sayfaya Dön
            </a>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                Bu demo oturumu 7 gün geçerlidir. Test için tasarlanmıştır.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">İletişim Bilgileri</h3>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Adınızı soyadınızı girin"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ornek@email.com"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}