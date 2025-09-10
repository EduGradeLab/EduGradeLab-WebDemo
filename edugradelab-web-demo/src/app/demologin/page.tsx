'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import Link from 'next/link'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export default function DemoLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRecaptchaLoad = () => {
    console.log('reCAPTCHA script loaded successfully')
    
    // Script yüklendikten sonra grecaptcha ready olana kadar bekle
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        console.log('reCAPTCHA ready and available')
        setRecaptchaLoaded(true)
      })
    } else {
      console.error('reCAPTCHA script loaded but grecaptcha object not available')
      // Biraz bekleyip tekrar dene
      setTimeout(() => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            console.log('reCAPTCHA ready after delay')
            setRecaptchaLoaded(true)
          })
        }
      }, 1000)
    }
  }

  useEffect(() => {
    // reCAPTCHA yüklendiğinde ready callback ile kontrol et
    if (typeof window !== 'undefined' && window.grecaptcha) {
      console.log('reCAPTCHA already available on window')
      window.grecaptcha.ready(() => {
        console.log('reCAPTCHA ready callback triggered')
        setRecaptchaLoaded(true)
      })
    }
  }, [])

  const handleDemoLogin = async () => {
    // Error mesajını temizle
    setError(null)
    
    const isProduction = process.env.NODE_ENV === 'production'
    const isTestKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
    
    console.log(`Environment: ${isProduction ? 'production' : 'development'}, Test key: ${isTestKey}`)
    
    if (!recaptchaLoaded) {
      setError('reCAPTCHA henüz yüklenmedi. Lütfen bekleyin.')
      return
    }

    setIsLoading(true)
    
    try {
      // reCAPTCHA v3 token al - BOT KONTROLÜ ZORUNLU
      let token
      try {
        if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
          throw new Error('reCAPTCHA site key not configured')
        }

        if (!window.grecaptcha) {
          throw new Error('reCAPTCHA not loaded - please refresh the page')
        }

        console.log('Attempting to get reCAPTCHA token...')
        console.log('Site key:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
        console.log('grecaptcha object:', window.grecaptcha)
        console.log('Is test key:', isTestKey)
        console.log('Environment:', isProduction ? 'production' : 'development')
        
        // reCAPTCHA ready olana kadar bekle
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('reCAPTCHA ready timeout'))
          }, 15000) // 15 saniye timeout (daha uzun)
          
          window.grecaptcha.ready(() => {
            clearTimeout(timeout)
            console.log('reCAPTCHA ready confirmed')
            resolve()
          })
        })

        console.log('Executing reCAPTCHA...')
        
        // Birkaç kez deneme mekanizması
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`reCAPTCHA attempt ${attempt}/3`)
            
            token = await window.grecaptcha.execute(
              process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
              { action: 'demo_login' }
            )
            
            console.log('reCAPTCHA execute result:', typeof token, token ? 'token received' : 'no token')
            
            if (token && typeof token === 'string' && token.length > 0) {
              console.log('reCAPTCHA token generated successfully on attempt', attempt)
              break
            }
            
            if (attempt < 3) {
              console.log('No token received, retrying in 1 second...')
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          } catch (executeError) {
            console.error(`reCAPTCHA execute attempt ${attempt} failed:`, executeError)
            if (attempt === 3) throw executeError
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
        
        if (!token || typeof token !== 'string' || token.length === 0) {
          // Test environment için fallback
          if (!isProduction && isTestKey) {
            console.warn('Test environment: reCAPTCHA token generation failed, proceeding with fallback')
            token = 'test-fallback-token-' + Date.now() // Test token
          } else {
            throw new Error('Failed to generate reCAPTCHA token after 3 attempts')
          }
        }
        
      } catch (recaptchaError) {
        console.error('reCAPTCHA error:', recaptchaError)
        // Bot kontrolü ZORUNLU - hata durumunda giriş yapılamaz
        const errorMessage = !isProduction && isTestKey 
          ? 'Test ortamında reCAPTCHA hatası. Lütfen sayfa yenilenerek tekrar deneyin.'
          : 'Bot kontrolü başarısız. Sayfa yenilenerek tekrar deneyin.'
        throw new Error(errorMessage)
      }

      // reCAPTCHA doğrulaması
      try {
        const recaptchaResponse = await fetch('/api/verify-recaptcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        if (!recaptchaResponse.ok) {
          const errorData = await recaptchaResponse.json().catch(() => ({ error: 'reCAPTCHA doğrulama hatası' }))
          throw new Error(errorData.error || 'Güvenlik kontrolü başarısız')
        }

        const recaptchaData = await recaptchaResponse.json()
        console.log('reCAPTCHA verification successful:', recaptchaData)
      } catch (verificationError) {
        console.error('reCAPTCHA verification error:', verificationError)
        throw new Error('Güvenlik kontrolü başarısız. Lütfen tekrar deneyin.')
      }

      // Demo girişi başarılı - yönlendir
      console.log('Demo login successful, redirecting...')
      window.location.href = '/demohome'
      
    } catch (error) {
      console.error('Demo login error:', error)
      setError(error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu')
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Lütfen geçerli bir e-posta adresi girin.')
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
        const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }))
        throw new Error(errorData.error || 'E-posta kaydedilemedi')
      }
    } catch (error) {
      console.error('Email save error:', error)
      alert('E-posta kaydedilirken bir hata oluştu: ' + (error as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
            {!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                ⚠️ reCAPTCHA yapılandırması eksik. Demo modda çalışıyor.
              </div>
            )}

            {process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                🔧 Development Mode: Test reCAPTCHA key kullanılıyor
                <br />
                {recaptchaLoaded ? '✅ reCAPTCHA yüklendi' : '⏳ reCAPTCHA yükleniyor...'}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                <span className="font-medium">Hata:</span> {error}
              </div>
            )}
            
                        <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className={`w-full text-white py-3 px-4 rounded-lg font-semibold transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {recaptchaLoaded && (
                    <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  Demo Girişi Yap
                  {!recaptchaLoaded && ' (Demo Mod)'}
                </div>
              )}
            </button>

            <button
              onClick={() => setShowEmailModal(true)}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              İletişim Bilgilerini Kaydet
            </button>

            <Link
              href="/"
              className="w-full block text-center text-gray-500 hover:text-gray-700 py-2"
            >
              Ana Sayfaya Dön
            </Link>
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

      {/* reCAPTCHA v3 Script */}
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
          onLoad={handleRecaptchaLoad}
          onError={() => {
            console.error('reCAPTCHA script failed to load')
            setRecaptchaLoaded(false)
          }}
        />
      )}
    </div>
  )
}