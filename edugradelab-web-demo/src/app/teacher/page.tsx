'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoTeachers,
  demoClasses,
  demoStudents,
  demoGrades,
  getClassesByTeacherId,
  getStudentsByClassId,
  getTeacherPerformance,
  getClassStats
} from '@/lib/demo-data'

export default function TeacherDashboard() {
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
  const performance = getTeacherPerformance().find(p => p.id === teacher.id)

  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0)
  const avgClassPerformance = classStats.length > 0
    ? Math.round(classStats.reduce((sum, stat) => sum + stat.avgGrade, 0) / classStats.length)
    : 0

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="teacher" activePage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldin, {teacher.name}! 👋</h1>
            <p className="text-gray-600">
              {teacher.branch} Öğretmeni • {teacher.title} • {classes.length} sınıf
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <span className="text-sm text-gray-500">Sınıflar</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {classes.length}
              </div>
              <div className="text-sm text-gray-600">
                Toplam sınıf
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <span className="text-sm text-gray-500">Öğrenciler</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalStudents}
              </div>
              <div className="text-sm text-gray-600">
                Toplam öğrenci
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-sm text-gray-500">Performans</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {performance?.avgPerformance || 0}%
              </div>
              <div className="text-sm text-gray-600">
                Ortalama başarı
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-sm text-gray-500">Sınıf Ort.</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {avgClassPerformance}
              </div>
              <div className="text-sm text-gray-600">
                Genel not ortalaması
              </div>
            </div>
          </div>

          {/* Classes Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Sınıflarım</h2>
              <Link href="/teacher/classes" className="text-purple-600 hover:text-purple-800 text-sm">
                Tümünü Yönet →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((cls) => {
                const stats = classStats.find(s => s.id === cls.id)
                return (
                  <div key={cls.id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{cls.name}</div>
                        <div className="text-sm text-gray-600">{cls.subject} • {cls.studentCount} öğrenci</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(stats?.avgGrade || 0)}`}>
                        %{stats?.avgGrade || 0}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Tamamlanma</div>
                        <div className="font-semibold text-gray-900">%{stats?.completionRate || 0}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Sınav Sayısı</div>
                        <div className="font-semibold text-gray-900">{stats?.exams.length || 0}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/teacher/classes/${cls.id}`}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Sınıfa Git →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Grades */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Son Notlanan Sınavlar</h2>
              <div className="space-y-4">
                {[
                  { className: '10-A Sınıfı', exam: 'Matematik Vize 1', students: 28, avg: 85, date: '2 gün önce' },
                  { className: '10-A Sınıfı', exam: 'Matematik Kısa Sınav', students: 28, avg: 82, date: '1 hafta önce' },
                  { className: '10-B Sınıfı', exam: 'Türkçe Kompozisyon', students: 26, avg: 78, date: '1 hafta önce' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-900">{activity.exam}</div>
                      <div className="text-sm text-gray-600">{activity.className} • {activity.students} öğrenci</div>
                      <div className="text-xs text-gray-500">{activity.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">%{activity.avg}</div>
                      <div className="text-sm text-gray-600">Ortalama</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Yaklaşan Görevler</h2>
              <div className="space-y-4">
                {[
                  { task: '10-A Fizik sınavı notlandırma', deadline: 'Bugün', priority: 'high', students: 25 },
                  { task: '12-C Kimya ödevi kontrol', deadline: 'Yarın', priority: 'medium', students: 22 },
                  { task: '10-B Türkçe kompozisyon değerlendirme', deadline: '3 gün', priority: 'low', students: 26 }
                ].map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <div className="font-semibold text-gray-900">{task.task}</div>
                        <div className="text-sm text-gray-600">{task.students} öğrenci</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{task.deadline}</div>
                      <div className={`text-xs ${
                        task.priority === 'high' ? 'text-red-600' :
                        task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {task.priority === 'high' ? 'Acil' :
                         task.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-gray-900">Yeni Sınav</div>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900">Notlandır</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm font-medium text-gray-900">Rapor Al</div>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📢</div>
                <div className="text-sm font-medium text-gray-900">Duyuru Yap</div>
              </button>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sınıf Performans Trendi</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              {[
                { month: 'Eylül', value: 78, trend: 'up' },
                { month: 'Ekim', value: 82, trend: 'up' },
                { month: 'Kasım', value: 85, trend: 'up' },
                { month: 'Aralık', value: 88, trend: 'stable' }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">{item.month}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    %{item.value}
                  </div>
                  <div className={`text-sm ${
                    item.trend === 'up' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {item.trend === 'up' ? '↑ Artış' : '→ Sabit'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm veriler örnek verilerdir.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}