'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoClasses,
  demoTeachers,
  demoStudents,
  demoExams,
  getTeacherById,
  getStudentsByClassId,
  getExamsByClassId,
  getClassStats,
  getTeacherPerformance
} from '@/lib/demo-data'

export default function AdminClasses() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState<string | null>(null)

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

  const filteredClasses = demoClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const classStatsData = getClassStats()
  const teacherPerformance = getTeacherPerformance()

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getClassStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-red-600 bg-red-100'
      case 'archived': return 'text-gray-600 bg-gray-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = getTeacherById(teacherId)
    return teacher?.name || 'Atanmamış'
  }

  const selectedClassData = selectedClass ? demoClasses.find(cls => cls.id === selectedClass) : null
  const selectedClassStudents = selectedClassData ? getStudentsByClassId(selectedClassData.id) : []
  const selectedClassExams = selectedClassData ? getExamsByClassId(selectedClassData.id) : []
  const selectedClassStats = selectedClassData ? classStatsData.find(stat => stat.id === selectedClassData.id) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="admin" activePage="classes" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sınıf Yönetimi</h1>
            <p className="text-gray-600">
              Tüm sınıfları görüntüleme ve yönetme • {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏫</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {demoClasses.length}
              </div>
              <div className="text-sm text-gray-600">Sınıf</div>
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
                <span className="text-sm text-gray-500">Ortalama</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(demoStudents.length / demoClasses.length)}
              </div>
              <div className="text-sm text-gray-600">Öğrenci/Sınıf</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-sm text-gray-500">Sistem</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(classStatsData.reduce((sum, stat) => sum + stat.avgGrade, 0) / classStatsData.length)}%
              </div>
              <div className="text-sm text-gray-600">Genel Ortalama</div>
            </div>
          </div>

          {/* Search and Class List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Class List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Sınıflar</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Sınıf ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔍
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredClasses.map((cls) => {
                    const classStat = classStatsData.find(stat => stat.id === cls.id)
                    const teacher = getTeacherById(cls.teacherId)

                    return (
                      <div
                        key={cls.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                          selectedClass === cls.id
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedClass(cls.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                Aktif
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{cls.subject}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>👨‍🏫 {teacher?.name || 'Atanmamış'}</span>
                              <span>👥 {cls.studentCount} öğrenci</span>
                              <span>📝 {getExamsByClassId(cls.id).length} sınav</span>
                            </div>
                          </div>
                          <div className="text-right">
                            {classStat && (
                              <>
                                <div className={`text-lg font-bold ${getPerformanceColor(classStat.avgGrade).split(' ')[0]}`}>
                                  %{classStat.avgGrade}
                                </div>
                                <div className="text-xs text-gray-500">Ortalama</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Class Details */}
            <div className="lg:col-span-1">
              {selectedClassData ? (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedClassData.name}</h2>
                    <p className="text-sm text-gray-600">{selectedClassData.subject}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Aktif
                      </span>
                      {selectedClassStats && (
                        <span className={`px-2 py-1 rounded-full text-xs ${getPerformanceColor(selectedClassStats.avgGrade)}`}>
                          %{selectedClassStats.avgGrade}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Class Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Öğretmen:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {getTeacherName(selectedClassData.teacherId)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Öğrenci Sayısı:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedClassData.studentCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sınav Sayısı:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedClassExams.length}
                      </span>
                    </div>
                    {selectedClassStats && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tamamlanma:</span>
                          <span className="text-sm font-medium text-gray-900">
                            %{selectedClassStats.completionRate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Ortalama:</span>
                          <span className="text-sm font-medium text-gray-900">
                            %{selectedClassStats.avgGrade}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                      <div className="text-sm font-medium text-blue-600">Sınıfı Düzenle</div>
                    </button>
                    <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                      <div className="text-sm font-medium text-purple-600">Öğrenci Ekle</div>
                    </button>
                    <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                      <div className="text-sm font-medium text-green-600">Sınav Oluştur</div>
                    </button>
                    <button className="w-full p-3 bg-red-50 hover:bg-red-100 rounded-xl text-center transition-colors">
                      <div className="text-sm font-medium text-red-600">Sınıfı Arşivle</div>
                    </button>
                  </div>

                  {/* Top Students */}
                  {selectedClassStudents.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">İlk 5 Öğrenci</h3>
                      <div className="space-y-2">
                        {selectedClassStudents.slice(0, 5).map((student) => (
                          <div key={student.id} className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs">👤</span>
                            </div>
                            <span className="text-sm text-gray-700 truncate">{student.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                  <div className="text-6xl mb-4">🏫</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Bir Sınıf Seçin</h3>
                  <p className="text-sm text-gray-600">
                    Sol taraftan bir sınıf seçerek detayları görüntüleyebilirsiniz.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Create New Class */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Yeni Sınıf Oluştur</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Sınıf Adı"
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Ders"
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Öğretmen Seç</option>
                {demoTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.branch}
                  </option>
                ))}
              </select>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                Sınıf Oluştur
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Sınıf yönetimi işlemleri simülasyondur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}