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
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [isReCaptchaLoaded, setIsReCaptchaLoaded] = useState(false)
  const router = useRouter()

  // Add environment-aware debug logging
  const isDev = process.env.NODE_ENV === 'development'
  
  const debugLog = (message: string, data?: any) => {
    if (isDev) {
      console.log(`[Demo Login Debug] ${message}`, data || '')
    }
  }

  useEffect(() => {
    debugLog('Component mounted, environment:', process.env.NODE_ENV)
  }, [])

  const handleReCaptchaLoad = () => {
    debugLog('reCAPTCHA script loaded successfully')
    setIsReCaptchaLoaded(true)
  }

  const generateReCaptchaToken = async (): Promise<string> => {
    debugLog('Starting reCAPTCHA token generation...')
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        debugLog('reCAPTCHA timeout - using fallback for development')
        // Development fallback - use test token
        if (isDev) {
          resolve('dev-test-token-' + Date.now())
        } else {
          reject(new Error('reCAPTCHA timeout'))
        }
      }, 10000)

      if (!window.grecaptcha) {
        debugLog('grecaptcha not available, using fallback')
        clearTimeout(timeout)
        if (isDev) {
          resolve('dev-no-grecaptcha-' + Date.now())
        } else {
          reject(new Error('reCAPTCHA not loaded'))
        }
        return
      }

      try {
        window.grecaptcha.ready(() => {
          debugLog('grecaptcha ready, executing...')
          const siteKey = isDev 
            ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'  // Test key for localhost
            : process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
          
          debugLog('Using site key:', siteKey.substring(0, 10) + '...')
          
          window.grecaptcha.execute(siteKey, { action: 'demo_login' })
            .then((token) => {
              clearTimeout(timeout)
              debugLog('reCAPTCHA token generated successfully:', token.substring(0, 20) + '...')
              resolve(token)
            })
            .catch((error) => {
              clearTimeout(timeout)
              debugLog('reCAPTCHA execution error:', error)
              // Development fallback
              if (isDev) {
                debugLog('Using fallback token for development')
                resolve('dev-error-fallback-' + Date.now())
              } else {
                reject(error)
              }
            })
        })
      } catch (error) {
        clearTimeout(timeout)
        debugLog('reCAPTCHA ready error:', error)
        if (isDev) {
          resolve('dev-catch-fallback-' + Date.now())
        } else {
          reject(error)
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    
    debugLog('Form submission started for email:', email)

    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Geçerli bir email adresi giriniz')
      }

      // Generate reCAPTCHA token with robust error handling
      debugLog('Generating reCAPTCHA token...')
      let recaptchaToken: string
      
      try {
        recaptchaToken = await generateReCaptchaToken()
        debugLog('Token generation successful')
      } catch (error) {
        debugLog('Token generation failed:', error)
        throw new Error('Güvenlik doğrulaması başarısız. Lütfen sayfayı yenileyin.')
      }

      setMessage('Güvenlik doğrulaması yapılıyor...')
      setMessageType('info')

      // Verify reCAPTCHA with backend
      debugLog('Sending verification request to backend...')
      const verifyResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: recaptchaToken,
          email: email 
        }),
      })

      debugLog('Backend response status:', verifyResponse.status)
      const verifyResult = await verifyResponse.json()
      debugLog('Backend response data:', verifyResult)

      if (!verifyResponse.ok || !verifyResult.success) {
        throw new Error(verifyResult.message || 'Güvenlik doğrulaması başarısız')
      }

      // Success
      setMessage('✅ Güvenlik doğrulaması başarılı! Demo sayfasına yönlendiriliyorsunuz...')
      setMessageType('success')
      
      debugLog('Login successful, redirecting to demo home')
      setTimeout(() => {
        router.push('/demohome')
      }, 1500)

    } catch (error: any) {
      debugLog('Login error:', error)
      setMessage(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* reCAPTCHA Script */}
      <Script 
        src={`https://www.google.com/recaptcha/api.js?render=${isDev ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        onLoad={handleReCaptchaLoad}
        strategy="afterInteractive"
      />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">EG</span>
            </div>
            <h1 className="text-4xl font-bold gradient-text">EduGradeLab</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Yapay Zeka Destekli Sınav Analizi
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Demo Deneyimi
            </h2>
            <p className="text-gray-600">
              AI destekli sınav analizimizi hemen deneyin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresiniz
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/90"
                  placeholder="ornek@email.com"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                messageType === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Giriş Yapılıyor...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🚀 Demo Başlat</span>
                </div>
              )}
            </button>

            {/* Security Info */}
            <div className="text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>reCAPTCHA ile güvenlik koruması</span>
              </p>
            </div>
          </form>

          {/* Demo Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Demo İçeriği
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-700">Dosya Yükleme</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-700">Hızlı Analiz</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-gray-700">Detaylı Rapor</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-700">Gerçek Zaman</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    </div>
  )
}