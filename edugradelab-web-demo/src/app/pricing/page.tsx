'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function PricingPage() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#features' || hash === '#nasıl-calisir') {
      router.push(`/${hash}`)
    }
  }, [router])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar showDemoButton={true} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full text-sm font-semibold mb-8">
            <span className="mr-2">⏳</span>
            Yakında Hizmetinizde
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Fiyatlandırma
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Hesaplanıyor</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            EduGradeLab&apos;in fiyatlandırma planları üzerinde çalışıyoruz.
            Yakında eğitim kurumlarınıza özel esnek ve uygun fiyat seçenekleri sunacağız.
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 mb-12">
            <div className="text-6xl mb-6">🧮</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Fiyatlarımız Belirleniyor
            </h2>
            <p className="text-gray-600 mb-8">
              Ekibimiz, farklı ölçeklerdeki eğitim kurumlarının ihtiyaçlarını karşılayacak
              en uygun fiyat modelini oluşturmak üzerinde çalışıyor.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <div className="text-3xl mb-3">🏫</div>
                <h3 className="font-semibold text-gray-900 mb-2">Küçük Okullar</h3>
                <p className="text-sm text-gray-600">Özel ders verenler ve küçük kurumlar için</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="font-semibold text-gray-900 mb-2">Orta Ölçekli</h3>
                <p className="text-sm text-gray-600">Orta büyüklükteki eğitim kurumları için</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <div className="text-3xl mb-3">🏢</div>
                <h3 className="font-semibold text-gray-900 mb-2">Kurumsal</h3>
                <p className="text-sm text-gray-600">Büyük eğitim zincirleri için özel çözümler</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-4">Bilgilendirilmek İster misiniz?</h3>
            <p className="text-blue-100 mb-6">
              Fiyatlandırma planlarımız hazır olduğunda size haber verelim.
              İlk duyurulanlardan biri olmak için bize ulaşın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Bilgi Al
              </Link>
              <Link href="/demologin" className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                Ücretsiz Demo Dene
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}