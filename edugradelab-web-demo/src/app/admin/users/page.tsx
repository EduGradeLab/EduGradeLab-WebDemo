'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoStudents,
  demoTeachers,
  getClassById,
  getGradesByStudentId,
  getTeacherPerformance,
  getClassStats
} from '@/lib/demo-data'

export default function AdminUsers() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students')
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredStudents = demoStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTeachers = demoTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.branch.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'text-purple-600 bg-purple-100'
      case 'admin': return 'text-red-600 bg-red-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'teacher': return 'Öğretmen'
      case 'admin': return 'Yönetici'
      default: return 'Öğrenci'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="admin" activePage="users" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanıcı Yönetimi</h1>
            <p className="text-gray-600">
              Tüm kullanıcıları görüntüleme ve yönetme • {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {demoStudents.length + demoTeachers.length}
              </div>
              <div className="text-sm text-gray-600">Kullanıcı</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {demoStudents.length}
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
                {demoTeachers.length}
              </div>
              <div className="text-sm text-gray-600">Öğretmen</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-sm text-gray-500">Sistem</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round((demoStudents.length + demoTeachers.length) / demoTeachers.length)}
              </div>
              <div className="text-sm text-gray-600">Öğrenci/Öğretmen</div>
            </div>
          </div>

          {/* Search and Tabs */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'students'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Öğrenciler ({demoStudents.length})
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'teachers'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Öğretmenler ({demoTeachers.length})
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            {/* Users Table */}
            {activeTab === 'students' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Öğrenci</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Sınıf</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Not Ortalaması</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Durum</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => {
                      const studentClass = getClassById(student.classId)
                      const grades = getGradesByStudentId(student.id)
                      const avgGrade = grades.length > 0
                        ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length)
                        : 0

                      return (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-lg">👤</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-600">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{studentClass?.name || '-'}</div>
                            <div className="text-sm text-gray-600">{studentClass?.subject || '-'}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(avgGrade)}`}>
                              {avgGrade > 0 ? `${avgGrade}/100` : 'Not yok'}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor('student')}`}>
                              {getRoleText('student')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Düzenle
                              </button>
                              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Öğretmen</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Branş</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Sınıf Sayısı</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Performans</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher) => {
                      const performance = getTeacherPerformance().find(t => t.id === teacher.id)

                      return (
                        <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-lg">👨‍🏫</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{teacher.name}</div>
                                <div className="text-sm text-gray-600">{teacher.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{teacher.branch}</div>
                            <div className="text-sm text-gray-600">{teacher.title}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{performance?.totalClasses || 0}</div>
                            <div className="text-sm text-gray-600">{performance?.totalStudents || 0} öğrenci</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(performance?.avgPerformance || 0)}`}>
                              %{performance?.avgPerformance || 0}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Düzenle
                              </button>
                              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">➕</div>
                <div className="text-sm font-medium text-gray-900">Yeni Öğrenci</div>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">➕</div>
                <div className="text-sm font-medium text-gray-900">Yeni Öğretmen</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📤</div>
                <div className="text-sm font-medium text-gray-900">Excel&apos;den İçe Aktar</div>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📥</div>
                <div className="text-sm font-medium text-gray-900">Excel&apos;e Aktar</div>
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Kullanıcı yönetimi işlemleri simülasyondur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}