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
  demoGrades,
  getGradesByStudentId
} from '@/lib/demo-data'

export default function TeacherGrading() {
  const [currentTeacher, setCurrentTeacher] = useState(demoTeachers[0])
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedExam, setSelectedExam] = useState<string>('')
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
  const teacherExams = demoExams.filter(exam => classes.some(cls => cls.id === exam.classId))

  const filteredStudents = selectedClass
    ? getStudentsByClassId(selectedClass)
    : demoStudents.slice(0, 10)

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getGradeLetter = (score: number) => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  // Mock grading data
  const gradingData = filteredStudents.map(student => {
    const studentGrades = getGradesByStudentId(student.id)
    const recentGrade = studentGrades[0] || { score: Math.floor(Math.random() * 30) + 70, maxScore: 100 }
    return {
      ...student,
      grade: recentGrade.score,
      maxScore: recentGrade.maxScore,
      percentage: Math.round((recentGrade.score / recentGrade.maxScore) * 100),
      status: recentGrade.score >= 70 ? 'passed' : 'failed',
      gradedAt: recentGrade.gradedAt || new Date().toISOString().split('T')[0]
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="teacher" activePage="grading" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notlandırma</h1>
            <p className="text-gray-600">
              {teacher.name} • {teacher.branch} • {filteredStudents.length} öğrenci
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sınıf Seç</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tüm Sınıflar</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.subject}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sınav Seç</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tüm Sınavlar</option>
                  {teacherExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grading Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(gradingData.reduce((sum, student) => sum + student.percentage, 0) / gradingData.length) || 0}
                </div>
                <div className="text-sm text-gray-600">Ortalama</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-green-600">
                  {gradingData.filter(s => s.status === 'passed').length}
                </div>
                <div className="text-sm text-gray-600">Geçen</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">❌</div>
                <div className="text-2xl font-bold text-red-600">
                  {gradingData.filter(s => s.status === 'failed').length}
                </div>
                <div className="text-sm text-gray-600">Kalan</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">⏳</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.floor(gradingData.length * 0.15)}
                </div>
                <div className="text-sm text-gray-600">Notlandırma Bekleyen</div>
              </div>
            </div>
          </div>

          {/* Student Grades Table */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Öğrenci Notları</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Toplu Notlandır
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Excel&apos;e Aktar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Öğrenci</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Numara</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Not</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Harf</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Durum</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Tarih</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {gradingData.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{student.avatar || '👤'}</div>
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{getClassById(student.classId)?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{student.studentNumber}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={student.grade}
                            className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <span className="text-gray-600">/100</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(student.percentage)}`}>
                          {getGradeLetter(student.percentage)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {student.status === 'passed' ? 'Geçti' : 'Kaldı'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">{student.gradedAt}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs">
                            Geri Bildirim
                          </button>
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs">
                            Kaydet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-sm font-medium text-gray-900">AI Notlandırma</div>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900">İstatistikler</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📧</div>
                <div className="text-sm font-medium text-gray-900">E-posta Gönder</div>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-gray-900">Rubrik Oluştur</div>
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm notlandırma işlemleri simülasyondur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}