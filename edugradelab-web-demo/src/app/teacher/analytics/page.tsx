'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoTeachers,
  getClassesByTeacherId,
  demoStudents,
  demoExams,
  getClassById,
  getStudentsByClassId,
  demoGrades
} from '@/lib/demo-data'

export default function TeacherAnalytics() {
  const [currentTeacher, setCurrentTeacher] = useState(demoTeachers[0])
  const [selectedClass, setSelectedClass] = useState<string>('')
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
  const filteredStudents = selectedClass
    ? getStudentsByClassId(selectedClass)
    : demoStudents.slice(0, 20)

  // Mock analytics data
  const classPerformance = classes.map(cls => ({
    id: cls.id,
    name: cls.name,
    average: 75 + Math.random() * 20,
    improvement: Math.round(Math.random() * 20 - 5),
    completion: 80 + Math.random() * 20
  }))

  const subjectPerformance = [
    { subject: 'Matematik', average: 82, improvement: '+5%', students: 28 },
    { subject: 'Fizik', average: 78, improvement: '+3%', students: 25 },
    { subject: 'Kimya', average: 85, improvement: '+8%', students: 22 },
    { subject: 'Türkçe', average: 88, improvement: '+12%', students: 26 }
  ]

  const studentRanking = filteredStudents
    .map(student => ({
      ...student,
      average: 70 + Math.random() * 25,
      improvement: Math.round(Math.random() * 20 - 5)
    }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="teacher" activePage="analytics" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sınıf Analizleri</h1>
            <p className="text-gray-600">
              {teacher.name} • {teacher.branch} • {classes.length} sınıf
            </p>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sınıf:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Tüm Sınıflar</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(classPerformance.reduce((sum, cls) => sum + cls.average, 0) / classPerformance.length) || 0}
                </div>
                <div className="text-sm text-gray-600">Genel Ortalama</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-green-600">
                  +{Math.round(classPerformance.reduce((sum, cls) => sum + cls.improvement, 0) / classPerformance.length) || 0}%
                </div>
                <div className="text-sm text-gray-600">Ortalama Gelişim</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(classPerformance.reduce((sum, cls) => sum + cls.completion, 0) / classPerformance.length) || 0}%
                </div>
                <div className="text-sm text-gray-600">Tamamlanma Oranı</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredStudents.length}
                </div>
                <div className="text-sm text-gray-600">Toplam Öğrenci</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Class Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sınıf Performansı</h2>
              <div className="space-y-4">
                {classPerformance.map((cls) => (
                  <div key={cls.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{cls.name}</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{Math.round(cls.average)}</span>
                        <span className={`text-sm font-medium ${
                          cls.improvement > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {cls.improvement > 0 ? '+' : ''}{cls.improvement}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${cls.average}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Ortalama</span>
                      <span>%{Math.round(cls.completion)} tamamlandı</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ders Bazında Performans</h2>
              <div className="space-y-4">
                {subjectPerformance.map((subject, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{subject.subject}</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{subject.average}</span>
                        <span className="text-sm text-green-600 font-medium">{subject.improvement}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${subject.average}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {subject.students} öğrenci
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Ranking */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Öğrenci Sıralaması</h2>
              <Link href="#" className="text-purple-600 hover:text-purple-800 text-sm">
                Tamamını Gör →
              </Link>
            </div>
            <div className="space-y-3">
              {studentRanking.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{student.avatar || '👤'}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.studentNumber}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{Math.round(student.average)}</div>
                      <div className={`text-sm font-medium ${
                        student.improvement > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.improvement > 0 ? '+' : ''}{student.improvement}%
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getGradeLetter(Math.round(student.average))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Raporlama</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900">Excel Raporu</div>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm font-medium text-gray-900">Grafikler</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📧</div>
                <div className="text-sm font-medium text-gray-900">E-posta Gönder</div>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">🖨️</div>
                <div className="text-sm font-medium text-gray-900">PDF Çıktı</div>
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
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

function getGradeLetter(score: number) {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}