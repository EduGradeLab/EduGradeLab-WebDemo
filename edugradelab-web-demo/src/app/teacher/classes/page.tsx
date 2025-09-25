'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoTeachers,
  getClassesByTeacherId,
  getClassStats,
  getTeacherById
} from '@/lib/demo-data'

export default function TeacherClasses() {
  const [currentTeacher, setCurrentTeacher] = useState(demoTeachers[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage'dan rol bilgisini kontrol et
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole !== 'teacher') {
      window.location.href = '/demologin'
      return
    }

    // Demo öğretmen yükleme
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const teacher = currentTeacher
  const classes = getClassesByTeacherId(teacher.id)
  const classStats = getClassStats().filter(stat => classes.some(cls => cls.id === stat.id))

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="teacher" activePage="classes" />
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sınıflarım</h1>
                <p className="text-gray-600">
                  {teacher.name} • {teacher.branch} • {classes.length} sınıf
                </p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                + Yeni Sınıf Oluştur
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-2xl font-bold text-gray-900">{classes.length}</div>
                <div className="text-sm text-gray-600">Toplam Sınıf</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-gray-900">
                  {classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Toplam Öğrenci</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(classStats.reduce((sum, stat) => sum + stat.avgGrade, 0) / classStats.length) || 0}
                </div>
                <div className="text-sm text-gray-600">Genel Ortalama</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(classStats.reduce((sum, stat) => sum + stat.completionRate, 0) / classStats.length) || 0}%
                </div>
                <div className="text-sm text-gray-600">Tamamlanma Oranı</div>
              </div>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => {
              const stats = classStats.find(s => s.id === cls.id)

              return (
                <div key={cls.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{cls.name}</div>
                      <div className="text-sm text-gray-600">{cls.subject}</div>
                    </div>
                    <div className="text-4xl opacity-50">🏫</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Öğrenci Sayısı:</span>
                      <span className="font-medium">{cls.studentCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sınıf Kodu:</span>
                      <span className="font-medium">{cls.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sınav Sayısı:</span>
                      <span className="font-medium">{stats?.exams.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Sınıf Ortalaması</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stats?.avgGrade || 0}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(stats?.avgGrade || 0)}`}>
                      %{stats?.avgGrade || 0}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/teacher/classes/${cls.id}`}
                      className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-center block"
                    >
                      Sınıfa Git
                    </Link>
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm">
                        📊 Rapor
                      </button>
                      <button className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm">
                        📝 Sınav
                      </button>
                      <button className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm">
                        📢 Duyuru
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-gray-900">Toplu Sınav Oluştur</div>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900">Genel Rapor</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📤</div>
                <div className="text-sm font-medium text-gray-900">Veri Aktar</div>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📧</div>
                <div className="text-sm font-medium text-gray-900">Toplu E-posta</div>
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm sınıf yönetimi işlemleri simülasyondur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}