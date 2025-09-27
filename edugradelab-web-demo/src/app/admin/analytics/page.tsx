'use client'

import { useState, useEffect } from 'react'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoStudents,
  demoTeachers,
  demoClasses,
  demoGrades,
  getTeacherPerformance,
  getClassStats,
} from '@/lib/demo-data'

export default function AdminAnalytics() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

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

  const teacherPerformance = getTeacherPerformance()
  const classStats = getClassStats()

  // Generate mock analytics data
  const generateAnalyticsData = () => {
    const periods = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    }

    const days = periods[selectedPeriod]
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      data.push({
        date: date.toISOString().split('T')[0],
        activeUsers: Math.floor(Math.random() * 200) + 100,
        gradesSubmitted: Math.floor(Math.random() * 50) + 20,
        examsCreated: Math.floor(Math.random() * 10) + 2,
        systemPerformance: Math.floor(Math.random() * 20) + 80
      })
    }

    return data
  }

  const analyticsData = generateAnalyticsData()

  // Calculate summary statistics
  const totalActiveUsers = analyticsData.reduce((sum, day) => sum + day.activeUsers, 0)
  const totalGradesSubmitted = analyticsData.reduce((sum, day) => sum + day.gradesSubmitted, 0)
  const totalExamsCreated = analyticsData.reduce((sum, day) => sum + day.examsCreated, 0)
  const avgSystemPerformance = Math.round(analyticsData.reduce((sum, day) => sum + day.systemPerformance, 0) / analyticsData.length)

  // Grade distribution
  const gradeDistribution = [
    { range: '90-100', count: Math.floor(demoGrades.length * 0.3), color: 'bg-green-500' },
    { range: '80-89', count: Math.floor(demoGrades.length * 0.25), color: 'bg-blue-500' },
    { range: '70-79', count: Math.floor(demoGrades.length * 0.2), color: 'bg-yellow-500' },
    { range: '60-69', count: Math.floor(demoGrades.length * 0.15), color: 'bg-orange-500' },
    { range: '0-59', count: Math.floor(demoGrades.length * 0.1), color: 'bg-red-500' }
  ]

  // Top performing classes
  const topClasses = classStats
    .sort((a, b) => b.avgGrade - a.avgGrade)
    .slice(0, 5)

  // Top performing teachers
  const topTeachers = teacherPerformance
    .sort((a, b) => b.avgPerformance - a.avgPerformance)
    .slice(0, 5)

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="admin" activePage="analytics" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistem Analizleri</h1>
            <p className="text-gray-600">
              Kapsamlı sistem raporları ve analitikler • {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Period Selector */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Rapor Periyodu</h2>
              <div className="flex space-x-2">
                {[
                  { value: 'week', label: 'Haftalık' },
                  { value: 'month', label: 'Aylık' },
                  { value: 'quarter', label: '3 Aylık' },
                  { value: 'year', label: 'Yıllık' }
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedPeriod === period.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(totalActiveUsers / analyticsData.length)}
              </div>
              <div className="text-sm text-gray-600">Günlük Aktif Kullanıcı</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalGradesSubmitted}
              </div>
              <div className="text-sm text-gray-600">Not Girişi</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalExamsCreated}
              </div>
              <div className="text-sm text-gray-600">Sınav Oluşturma</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <span className="text-sm text-gray-500">Sistem</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {avgSystemPerformance}%
              </div>
              <div className="text-sm text-gray-600">Performans</div>
            </div>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Grade Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Not Dağılımı</h2>
              <div className="space-y-4">
                {gradeDistribution.map((grade) => {
                  const percentage = (grade.count / demoGrades.length) * 100
                  return (
                    <div key={grade.range} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{grade.range}</span>
                        <span className="text-sm text-gray-600">
                          {grade.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${grade.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Classes */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">En Başarılı Sınıflar</h2>
              <div className="space-y-4">
                {topClasses.map((cls, index) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100' :
                        index === 1 ? 'bg-gray-100' :
                        index === 2 ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{cls.name}</div>
                        <div className="text-sm text-gray-600">{cls.subject}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(cls.avgGrade)}`}>
                      %{cls.avgGrade}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Teachers */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">En Başarılı Öğretmenler</h2>
              <div className="space-y-4">
                {topTeachers.map((teacher, index) => (
                  <div key={teacher.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100' :
                        index === 1 ? 'bg-gray-100' :
                        index === 2 ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{teacher.name}</div>
                        <div className="text-sm text-gray-600">{teacher.branch}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(teacher.avgPerformance)}`}>
                      %{teacher.avgPerformance}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem Metrikleri</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {demoStudents.length + demoTeachers.length}
                  </div>
                  <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {demoClasses.length}
                  </div>
                  <div className="text-sm text-gray-600">Aktif Sınıf</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {demoGrades.length}
                  </div>
                  <div className="text-sm text-gray-600">Toplam Not</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {Math.round(demoGrades.reduce((sum, grade) => sum + grade.score, 0) / demoGrades.length)}
                  </div>
                  <div className="text-sm text-gray-600">Genel Ortalama</div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Rapor İndir</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900">Excel Raporu</div>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm font-medium text-gray-900">PDF Raporu</div>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📋</div>
                <div className="text-sm font-medium text-gray-900">Detaylı Rapor</div>
              </button>
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📧</div>
                <div className="text-sm font-medium text-gray-900">E-posta Gönder</div>
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm analiz verileri örnek verilerdir.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}