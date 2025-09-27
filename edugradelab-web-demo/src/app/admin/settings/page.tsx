'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'general' | 'school' | 'users' | 'system' | 'integrations'>('general')
  const [settings, setSettings] = useState({
    schoolName: 'EduGradeLab Demo Okulu',
    schoolYear: '2024-2025',
    academicTerm: 'Güz Dönemi',
    timezone: 'Europe/Istanbul',
    language: 'tr',
    gradeSystem: '100',
    passingGrade: '60',
    maxClassSize: '30',
    allowTeacherGrading: 'true',
    enableNotifications: 'true',
    maintenanceMode: 'false',
    backupEnabled: 'true',
    backupFrequency: 'daily',
    retentionPeriod: '365'
  })

  useEffect(() => {
    // localStorage'dan rol bilgisini kontrol et
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole !== 'admin') {
      window.location.href = '/demologin'
      return
    }

    // Demo admin yükleme
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // Demo mode: just show success message
    alert('Ayarlar başarıyla kaydedildi! (Demo Modu)')
  }

  const tabs = [
    { id: 'general', label: 'Genel', icon: '⚙️' },
    { id: 'school', label: 'Okul', icon: '🏫' },
    { id: 'users', label: 'Kullanıcılar', icon: '👥' },
    { id: 'system', label: 'Sistem', icon: '🖥️' },
    { id: 'integrations', label: 'Entegrasyonlar', icon: '🔗' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="admin" activePage="settings" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistem Ayarları</h1>
            <p className="text-gray-600">
              Okul ve sistem yapılandırması • {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Settings Navigation */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Genel Ayarlar</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Okul Adı
                    </label>
                    <input
                      type="text"
                      value={settings.schoolName}
                      onChange={(e) => handleSettingChange('schoolName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Okul Yılı
                    </label>
                    <input
                      type="text"
                      value={settings.schoolYear}
                      onChange={(e) => handleSettingChange('schoolYear', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dönem
                    </label>
                    <select
                      value={settings.academicTerm}
                      onChange={(e) => handleSettingChange('academicTerm', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Güz Dönemi">Güz Dönemi</option>
                      <option value="Bahar Dönemi">Bahar Dönemi</option>
                      <option value="Yaz Dönemi">Yaz Dönemi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Saat Dilimi
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                      <option value="Europe/Ankara">Ankara (GMT+3)</option>
                      <option value="Europe/Izmir">İzmir (GMT+3)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dil
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* School Settings */}
            {activeTab === 'school' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Okul Ayarları</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Not Sistemi
                    </label>
                    <select
                      value={settings.gradeSystem}
                      onChange={(e) => handleSettingChange('gradeSystem', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="100">100 Puanlık Sistem</option>
                      <option value="5">5 Puanlık Sistem</option>
                      <option value="4">4 Puanlık Sistem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Geçme Notu
                    </label>
                    <input
                      type="number"
                      value={settings.passingGrade}
                      onChange={(e) => handleSettingChange('passingGrade', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maksimum Sınıf Mevcudu
                    </label>
                    <input
                      type="number"
                      value={settings.maxClassSize}
                      onChange={(e) => handleSettingChange('maxClassSize', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Öğretmen Notlandırma
                    </label>
                    <select
                      value={settings.allowTeacherGrading}
                      onChange={(e) => handleSettingChange('allowTeacherGrading', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Pasif</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* User Settings */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Kullanıcı Ayarları</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bildirimler
                    </label>
                    <select
                      value={settings.enableNotifications}
                      onChange={(e) => handleSettingChange('enableNotifications', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Pasif</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şifre Politikası
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Standart</option>
                        <option>Güçlü</option>
                        <option>Çok Güçlü</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı İzinleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                      <span className="text-sm text-gray-700">Öğrenci kaydı oluşturma</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                      <span className="text-sm text-gray-700">Öğretmen atama</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                      <span className="text-sm text-gray-700">Sınıf düzenleme</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Toplu veri içe aktarma</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem Ayarları</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bakım Modu
                    </label>
                    <select
                      value={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="false">Kapalı</option>
                      <option value="true">Açık</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yedekleme
                    </label>
                    <select
                      value={settings.backupEnabled}
                      onChange={(e) => handleSettingChange('backupEnabled', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Pasif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yedekleme Sıklığı
                    </label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hourly">Saatlik</option>
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="monthly">Aylık</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Veri Saklama Süresi (gün)
                    </label>
                    <input
                      type="number"
                      value={settings.retentionPeriod}
                      onChange={(e) => handleSettingChange('retentionPeriod', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl mb-2">🟢</div>
                      <div className="text-sm font-medium text-gray-900">Veritabanı</div>
                      <div className="text-xs text-gray-600">Sağlıklı</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl mb-2">🟢</div>
                      <div className="text-sm font-medium text-gray-900">API</div>
                      <div className="text-xs text-gray-600">Çalışıyor</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <div className="text-2xl mb-2">🟡</div>
                      <div className="text-sm font-medium text-gray-900">Depolama</div>
                      <div className="text-xs text-gray-600">%67 dolu</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Entegrasyonlar</h2>

                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📧</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">E-posta Servisi</h3>
                          <p className="text-sm text-gray-600">Bildirim ve rapor e-postaları</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📱</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">SMS Servisi</h3>
                          <p className="text-sm text-gray-600">Önemli bildirimler için SMS</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🤖</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">Yapay Zeka Servisleri</h3>
                          <p className="text-sm text-gray-600">Yapay zeka destekli not analizi</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📊</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">Analytics</h3>
                          <p className="text-sm text-gray-600">Kullanıcı davranış analizi</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Ayarları Kaydet
              </button>
            </div>
          </div>

          {/* System Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem İşlemleri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">💾</div>
                <div className="text-sm font-medium text-gray-900">Yedekle</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-sm font-medium text-gray-900">Senkronize Et</div>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">🧹</div>
                <div className="text-sm font-medium text-gray-900">Önbelleği Temizle</div>
              </button>
              <button className="p-4 bg-red-50 hover:bg-red-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-gray-900">Logları İndir</div>
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Ayar değişiklikleri simülasyondur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}