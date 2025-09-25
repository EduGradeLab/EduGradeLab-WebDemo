'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoTeachers,
  getClassesByTeacherId,
  demoExams,
  getClassById
} from '@/lib/demo-data'

export default function TeacherExams() {
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
  const teacherExams = demoExams.filter(exam => classes.some(cls => cls.id === exam.classId))

  const getExamTypeIcon = (type: string) => {
    switch (type) {
      case 'midterm': return '📝'
      case 'final': return '🎯'
      case 'quiz': return '❓'
      case 'assignment': return '📚'
      default: return '📄'
    }
  }

  const getExamTypeText = (type: string) => {
    switch (type) {
      case 'midterm': return 'Vize'
      case 'final': return 'Final'
      case 'quiz': return 'Kısa Sınav'
      case 'assignment': return 'Ödev'
      default: return 'Sınav'
    }
  }

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'midterm': return 'bg-blue-100 text-blue-700'
      case 'final': return 'bg-red-100 text-red-700'
      case 'quiz': return 'bg-yellow-100 text-yellow-700'
      case 'assignment': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="teacher" activePage="exams" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sınav Yönetimi</h1>
                <p className="text-gray-600">
                  {teacher.name} • {teacher.branch} • {teacherExams.length} sınav
                </p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                + Yeni Sınav Oluştur
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-2xl font-bold text-gray-900">{teacherExams.length}</div>
                <div className="text-sm text-gray-600">Toplam Sınav</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-2xl font-bold text-gray-900">
                  {teacherExams.filter(e => e.type === 'midterm' || e.type === 'final').length}
                </div>
                <div className="text-sm text-gray-600">Ana Sınav</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">❓</div>
                <div className="text-2xl font-bold text-gray-900">
                  {teacherExams.filter(e => e.type === 'quiz').length}
                </div>
                <div className="text-sm text-gray-600">Kısa Sınav</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-2xl font-bold text-gray-900">
                  {teacherExams.filter(e => e.type === 'assignment').length}
                </div>
                <div className="text-sm text-gray-600">Ödev</div>
              </div>
            </div>
          </div>

          {/* Exams List */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tüm Sınavlar</h2>
            <div className="space-y-4">
              {teacherExams.map((exam) => {
                const examClass = getClassById(exam.classId)
                const examDate = new Date(exam.date)
                const isUpcoming = examDate > new Date()

                return (
                  <div key={exam.id} className={`p-6 rounded-xl border-2 transition-all ${
                    isUpcoming
                      ? 'border-blue-200 bg-blue-50 hover:border-blue-300'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{getExamTypeIcon(exam.type)}</div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{exam.title}</div>
                          <div className="text-sm text-gray-600">{examClass?.name} • {examClass?.subject}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${getExamTypeColor(exam.type)}`}>
                          {getExamTypeText(exam.type)}
                        </div>
                        {isUpcoming && (
                          <div className="text-xs text-blue-600 font-medium">
                            {Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} gün kaldı
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Süre</div>
                        <div className="font-medium text-gray-900">{exam.duration} dakika</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Puan</div>
                        <div className="font-medium text-gray-900">{exam.totalPoints} puan</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Tarih</div>
                        <div className="font-medium text-gray-900">{examDate.toLocaleDateString('tr-TR')}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Durum</div>
                        <div className={`font-medium ${
                          isUpcoming ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {isUpcoming ? 'Yaklaşan' : 'Tamamlandı'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        Düzenle
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Sonuçları Gör
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                        İstatistikler
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                        Sil
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-gray-900">Vize Oluştur</div>
              </button>
              <button className="p-4 bg-red-50 hover:bg-red-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm font-medium text-gray-900">Final Oluştur</div>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">❓</div>
                <div className="text-sm font-medium text-gray-900">Kısa Sınav</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-sm font-medium text-gray-900">Ödev Ver</div>
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm sınav işlemleri simülasyondur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}