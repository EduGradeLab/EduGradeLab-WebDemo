'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoClasses,
  getClassById,
  getTeacherById,
  getExamsByClassId,
  demoStudents,
  getGradesByStudentId
} from '@/lib/demo-data'

export default function StudentClassDetail() {
  const params = useParams()
  const [classData, setClassData] = useState<any>(null)
  const [teacher, setTeacher] = useState<any>(null)
  const [exams, setExams] = useState<any[]>([])
  const [currentStudent, setCurrentStudent] = useState(demoStudents[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage'dan rol bilgisini kontrol et
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole !== 'student') {
      window.location.href = '/demologin'
      return
    }

    const classId = params.id as string
    if (classId) {
      const foundClass = getClassById(classId)
      const classTeacher = getTeacherById(foundClass?.teacherId || '')
      const classExams = getExamsByClassId(classId)

      setClassData(foundClass)
      setTeacher(classTeacher)
      setExams(classExams)
    }

    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <Link href="/student/classes" className="text-green-600 hover:text-green-800">
            Sınıflarıma Dön
          </Link>
        </div>
      </div>
    )
  }

  const studentGrades = getGradesByStudentId(currentStudent.id)
  const studentAverage = studentGrades.length > 0
    ? Math.round(studentGrades.reduce((sum, grade) => sum + grade.score, 0) / studentGrades.length)
    : 0

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="student" activePage="classes" />
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Link href="/student/classes" className="text-green-600 hover:text-green-800 text-sm">
                  ← Sınıflarıma Dön
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{classData.name}</h1>
                <p className="text-gray-600">
                  {classData.subject} • {teacher?.name} • {new Date().toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{studentAverage}</div>
                <div className="text-sm text-gray-600">Sınav Ortalamam</div>
              </div>
            </div>
          </div>

          {/* Class Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">📚</div>
                <div className="font-semibold text-gray-900">{classData.subject}</div>
                <div className="text-sm text-gray-600">Ders</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">👨‍🏫</div>
                <div className="font-semibold text-gray-900">{teacher?.name}</div>
                <div className="text-sm text-gray-600">Öğretmen</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">👥</div>
                <div className="font-semibold text-gray-900">{classData.studentCount}</div>
                <div className="text-sm text-gray-600">Sınıf Mevcudu</div>
              </div>
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Yaklaşan Sınavlar</h2>
            <div className="space-y-4">
              {exams.slice(0, 3).map((exam) => {
                const examDate = new Date(exam.date)
                const isUpcoming = examDate > new Date()

                return (
                  <div key={exam.id} className={`p-4 rounded-xl ${
                    isUpcoming ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{exam.title}</div>
                        <div className="text-sm text-gray-600">
                          {exam.duration} dakika • {exam.totalPoints} puan
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {examDate.toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          exam.type === 'midterm' ? 'bg-blue-100 text-blue-700' :
                          exam.type === 'final' ? 'bg-red-100 text-red-700' :
                          exam.type === 'quiz' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {exam.type === 'midterm' ? 'Vize' :
                           exam.type === 'final' ? 'Final' :
                           exam.type === 'quiz' ? 'Kısa Sınav' : 'Ödev'}
                        </div>
                        {isUpcoming && (
                          <div className="text-xs text-blue-600 mt-2">
                            {Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} gün kaldı
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Grades */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notlarım</h2>
              <div className="space-y-4">
                {studentGrades.slice(0, 4).map((grade) => {
                  const exam = exams.find(e => e.id === grade.examId)
                  const percentage = Math.round((grade.score / grade.maxScore) * 100)

                  return (
                    <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {exam?.title || `Sınav #${grade.examId}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(grade.gradedAt).toLocaleDateString('tr-TR')}
                        </div>
                        {grade.feedback && (
                          <div className="text-xs text-gray-700 mt-1 italic">
                            &ldquo;{grade.feedback}&rdquo;
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getGradeColor(percentage).split(' ')[0]}`}>
                          {grade.score}/{grade.maxScore}
                        </div>
                        <div className={`text-sm px-2 py-1 rounded-full ${getGradeColor(percentage)}`}>
                          {getGradeLetter(percentage)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Class Announcements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sınıf Duyuruları</h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Haftalık Ders Programı',
                    content: 'Bu hafta perşembe günü ek ders yapılacaktır.',
                    date: '2 gün önce',
                    type: 'info'
                  },
                  {
                    title: 'Ödev Teslim Tarihi',
                    content: 'Matematik ödevi cuma günü sonuna kadar teslim edilecek.',
                    date: '3 gün önce',
                    type: 'warning'
                  },
                  {
                    title: 'Sınav Sonuçları',
                    content: 'Son sınav sonuçları açıklandı. Portal üzerinden kontrol edebilirsiniz.',
                    date: '1 hafta önce',
                    type: 'success'
                  }
                ].map((announcement, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        announcement.type === 'info' ? 'bg-blue-500' :
                        announcement.type === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{announcement.title}</div>
                        <div className="text-sm text-gray-600 mb-2">{announcement.content}</div>
                        <div className="text-xs text-gray-500">{announcement.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Class Materials */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ders Materyalleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Konu Anlatım PDF', type: 'pdf', size: '2.5 MB', date: '1 hafta önce' },
                { name: 'Alıştırma Soruları', type: 'doc', size: '1.2 MB', date: '2 hafta önce' },
                { name: 'Çözümlü Örnekler', type: 'pdf', size: '3.8 MB', date: '3 hafta önce' },
                { name: 'Ders Sunumu', type: 'ppt', size: '5.1 MB', date: '1 ay önce' },
                { name: 'Videolu Anlatım', type: 'video', size: '125 MB', date: '1 ay önce' },
                { name: 'Özet Notlar', type: 'pdf', size: '856 KB', date: '1 ay önce' }
              ].map((material, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl">
                      {material.type === 'pdf' ? '📄' :
                       material.type === 'doc' ? '📝' :
                       material.type === 'ppt' ? '📊' :
                       material.type === 'video' ? '🎥' : '📁'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{material.name}</div>
                      <div className="text-xs text-gray-600">{material.size}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{material.date}</div>
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
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm sınıf bilgileri örnek verilerdir.</p>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  )
}