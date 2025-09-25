'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoClasses,
  getClassById,
  getStudentsByClassId,
  getExamsByClassId,
  getTeacherById,
  demoGrades,
  getGradesByStudentId
} from '@/lib/demo-data'

export default function TeacherClassDetail() {
  const params = useParams()
  const [classData, setClassData] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage'dan rol bilgisini kontrol et
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole !== 'teacher') {
      window.location.href = '/demologin'
      return
    }

    const classId = params.id as string
    if (classId) {
      const foundClass = getClassById(classId)
      const classStudents = getStudentsByClassId(classId)
      const classExams = getExamsByClassId(classId)

      setClassData(foundClass)
      setStudents(classStudents)
      setExams(classExams)
    }

    setIsLoading(false)
  }, [params.id])

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

  if (!classData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sınıf Bulunamadı</h1>
          <Link href="/teacher/classes" className="text-purple-600 hover:text-purple-800">
            Sınıflara Dön
          </Link>
        </div>
      </div>
    )
  }

  const teacher = getTeacherById(classData.teacherId)
  const avgGrade = 75 + Math.random() * 20 // Random average for demo

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <RoleSidebar role="teacher" activePage="classes" />
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Link href="/teacher/classes" className="text-purple-600 hover:text-purple-800 text-sm">
                  ← Sınıflara Dön
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{classData.name}</h1>
                <p className="text-gray-600">
                  {classData.subject} • {teacher?.name} • {students.length} öğrenci
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{Math.round(avgGrade)}</div>
                <div className="text-sm text-gray-600">Sınıf Ortalaması</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {students.length}
              </div>
              <div className="text-sm text-gray-600">Öğrenci</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <span className="text-sm text-gray-500">Toplam</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {exams.length}
              </div>
              <div className="text-sm text-gray-600">Sınav</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <span className="text-sm text-gray-500">Tamamlanma</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(85 + Math.random() * 15)}%
              </div>
              <div className="text-sm text-gray-600">Ödev Tamamlama</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-sm text-gray-500">Performans</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(80 + Math.random() * 20)}%
              </div>
              <div className="text-sm text-gray-600">Başarı Oranı</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Students List */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Öğrenciler</h2>
                <button className="text-purple-600 hover:text-purple-800 text-sm">
                  Öğrenci Ekle +
                </button>
              </div>
              <div className="space-y-4">
                {students.map((student) => {
                  const grades = getGradesByStudentId(student.id)
                  const avgGrade = grades.length > 0
                    ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length)
                    : 0

                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{student.avatar || '👤'}</div>
                        <div>
                          <div className="font-semibold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.studentNumber}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getGradeColor(avgGrade).split(' ')[0]}`}>
                          {avgGrade || '-'}
                        </div>
                        <div className="text-sm text-gray-600">Ortalama</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Exams */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Sınavlar</h2>
                <button className="text-purple-600 hover:text-purple-800 text-sm">
                  Yeni Sınav +
                </button>
              </div>
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div key={exam.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">{exam.title}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exam.type === 'midterm' ? 'bg-blue-100 text-blue-700' :
                        exam.type === 'final' ? 'bg-red-100 text-red-700' :
                        exam.type === 'quiz' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {exam.type === 'midterm' ? 'Vize' :
                         exam.type === 'final' ? 'Final' :
                         exam.type === 'quiz' ? 'Kısa Sınav' : 'Ödev'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div>{exam.duration} dakika • {exam.totalPoints} puan</div>
                      <div>{new Date(exam.date).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Not Dağılımı</h2>
            <div className="grid grid-cols-5 gap-4">
              {[
                { range: '90-100', label: 'A', color: 'bg-green-500', count: Math.floor(students.length * 0.3) },
                { range: '80-89', label: 'B', color: 'bg-blue-500', count: Math.floor(students.length * 0.4) },
                { range: '70-79', label: 'C', color: 'bg-yellow-500', count: Math.floor(students.length * 0.2) },
                { range: '60-69', label: 'D', color: 'bg-orange-500', count: Math.floor(students.length * 0.08) },
                { range: '0-59', label: 'F', color: 'bg-red-500', count: Math.floor(students.length * 0.02) }
              ].map((grade, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${grade.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white font-bold text-xl">{grade.label}</span>
                  </div>
                  <div className="text-sm text-gray-600">{grade.range}</div>
                  <div className="text-lg font-bold text-gray-900">{grade.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sınıf İşlemleri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-gray-900">Sınav Oluştur</div>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900">Rapor Al</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📢</div>
                <div className="text-sm font-medium text-gray-900">Duyuru Yap</div>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📤</div>
                <div className="text-sm font-medium text-gray-900">Veri Aktar</div>
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm sınıf işlemleri simülasyondur.</p>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  )
}