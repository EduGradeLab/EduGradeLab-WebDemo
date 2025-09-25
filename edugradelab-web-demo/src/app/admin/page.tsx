'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoTeachers,
  demoStudents,
  demoClasses,
  demoGrades,
  getTeacherPerformance,
  getClassStats
} from '@/lib/demo-data'

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)

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

  const totalStudents = demoStudents.length
  const totalTeachers = demoTeachers.length
  const totalClasses = demoClasses.length
  const totalGrades = demoGrades.length

  const teacherPerformance = getTeacherPerformance()
  const classStats = getClassStats()

  const avgSystemPerformance = teacherPerformance.length > 0
    ? Math.round(teacherPerformance.reduce((sum, teacher) => sum + teacher.avgPerformance, 0) / teacherPerformance.length)
    : 0

  
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="admin" activePage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Paneli</h1>
            <p className="text-gray-600">
              Sistem Yönetimi • {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalStudents}
              </div>
              <div className="text-sm text-gray-600">Öğrenci</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalTeachers}
              </div>
              <div className="text-sm text-gray-600">Öğretmen</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏫</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalClasses}
              </div>
              <div className="text-sm text-gray-600">Sınıf</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalGrades}
              </div>
              <div className="text-sm text-gray-600">Notlandırma</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-sm text-gray-500">Sistem</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {avgSystemPerformance}%
              </div>
              <div className="text-sm text-gray-600">Performans</div>
            </div>
          </div>

          {/* Teacher Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Öğretmen Performansı</h2>
              <Link href="/admin/users" className="text-red-600 hover:text-red-800 text-sm">
                Detaylı Görüntüle →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Öğretmen</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Branş</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Sınıf</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Öğrenci</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Performans</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherPerformance.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{teacher.name}</div>
                        <div className="text-sm text-gray-600">{teacher.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{teacher.branch}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{teacher.totalClasses}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{teacher.totalStudents}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(teacher.avgPerformance)}`}>
                          %{teacher.avgPerformance}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Class Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Class Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sınıf Başarı Durumu</h2>
              <div className="space-y-4">
                {classStats.slice(0, 5).map((stat) => (
                  <div key={stat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-900">{stat.name}</div>
                      <div className="text-sm text-gray-600">{stat.subject} • {stat.studentCount} öğrenci</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">%{stat.avgGrade}</div>
                      <div className="text-sm text-gray-600">Tamamlanma: %{stat.completionRate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem Sağlığı</h2>
              <div className="space-y-6">
                {[
                  { name: 'Sunucu Durumu', value: '99.9%', status: 'excellent', icon: '🖥️' },
                  { name: 'Veritabanı', value: 'Optimum', status: 'good', icon: '🗄️' },
                  { name: 'API Response', value: '145ms', status: 'good', icon: '⚡' },
                  { name: 'Disk Kullanımı', value: '67%', status: 'warning', icon: '💾' },
                  { name: 'Aktif Kullanıcı', value: '248', status: 'excellent', icon: '👤' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="font-semibold text-gray-900">{item.value}</div>
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'excellent' ? 'bg-green-500' :
                        item.status === 'good' ? 'bg-blue-500' :
                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem Aktivitesi</h2>
            <div className="space-y-4">
              {[
                { action: 'Dr. Selin Aksoy 10-A sınıfına sınav ekledi', time: '5 dakika önce', type: 'exam' },
                { action: '28 öğrenci notu güncellendi', time: '15 dakika önce', type: 'grade' },
                { action: 'Yeni kullanıcı kaydı: Ayşe Demir', time: '1 saat önce', type: 'user' },
                { action: 'Sistem yedeklemesi tamamlandı', time: '2 saat önce', type: 'system' },
                { action: 'Ahmet Yılmaz 11-B sınıfı notlarını kontrol etti', time: '3 saat önce', type: 'grade' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'exam' ? 'bg-purple-100' :
                    activity.type === 'grade' ? 'bg-blue-100' :
                    activity.type === 'user' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-lg">
                      {activity.type === 'exam' ? '📝' :
                       activity.type === 'grade' ? '📊' :
                       activity.type === 'user' ? '👤' : '⚙️'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-600">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Yönetim İşlemleri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-red-50 hover:bg-red-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm font-medium text-gray-900">Kullanıcı Yönetimi</div>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900">Raporlar</div>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm font-medium text-gray-900">Sistem Ayarları</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm font-medium text-gray-900">Analizler</div>
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm yönetim işlemleri simülasyondur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}