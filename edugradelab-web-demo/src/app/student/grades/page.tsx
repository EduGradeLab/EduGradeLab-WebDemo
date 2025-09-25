'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoStudents,
  getStudentById,
  getGradesByStudentId,
  getClassById,
  demoExams
} from '@/lib/demo-data'

export default function StudentGrades() {
  const [currentStudent, setCurrentStudent] = useState(demoStudents[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage'dan rol bilgisini kontrol et
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole !== 'student') {
      window.location.href = '/demologin'
      return
    }

    // Demo öğrenci yükleme
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const student = currentStudent
  const grades = getGradesByStudentId(student.id)
  const studentClass = getClassById(student.classId)

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    if (score >= 60) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getGradeLetter = (score: number) => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

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

  // Calculate statistics
  const averageScore = grades.length > 0
    ? Math.round(grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / grades.length)
    : 0

  const totalExams = grades.length
  const passedExams = grades.filter(grade => grade.score >= 60).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="student" activePage="grades" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notlarım</h1>
            <p className="text-gray-600">
              {student.name} • {studentClass?.name} • {totalExams} sınav
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-sm text-gray-500">Ortalama</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {averageScore}%
              </div>
              <div className="text-sm text-gray-600">
                Tüm sınavlar
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <span className="text-sm text-gray-500">Geçti</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {passedExams}/{totalExams}
              </div>
              <div className="text-sm text-gray-600">
                Başarılı sınavlar
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-sm text-gray-500">Sıralama</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.floor(Math.random() * 10) + 1}
              </div>
              <div className="text-sm text-gray-600">
                Sınıf içi
              </div>
            </div>
          </div>

          {/* Grades List */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tüm Notlar</h2>
              <div className="text-sm text-gray-500">
                Toplam {grades.length} sınav
              </div>
            </div>

            <div className="space-y-4">
              {grades.map((grade) => {
                const exam = demoExams.find(e => e.id === grade.examId)
                const percentage = Math.round((grade.score / grade.maxScore) * 100)

                return (
                  <div key={grade.id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{getExamTypeIcon(exam?.type || '')}</div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {exam?.title || `Sınav #${grade.examId}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getExamTypeText(exam?.type || '')} • {new Date(grade.gradedAt).toLocaleDateString('tr-TR')}
                          </div>
                          {grade.feedback && (
                            <div className="text-sm text-gray-700 mt-1 italic">
                              "{grade.feedback}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {grade.score}/{grade.maxScore}
                            </div>
                            <div className="text-sm text-gray-600">
                              %{percentage}
                            </div>
                          </div>
                          <div className={`text-lg font-bold px-3 py-1 rounded-full ${getGradeColor(percentage)}`}>
                            {getGradeLetter(percentage)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Not Dağılımı</h2>
            <div className="grid grid-cols-5 gap-4">
              {[
                { range: '90-100', label: 'A', color: 'bg-green-500', count: grades.filter(g => (g.score/g.maxScore)*100 >= 90).length },
                { range: '80-89', label: 'B', color: 'bg-blue-500', count: grades.filter(g => (g.score/g.maxScore)*100 >= 80 && (g.score/g.maxScore)*100 < 90).length },
                { range: '70-79', label: 'C', color: 'bg-yellow-500', count: grades.filter(g => (g.score/g.maxScore)*100 >= 70 && (g.score/g.maxScore)*100 < 80).length },
                { range: '60-69', label: 'D', color: 'bg-orange-500', count: grades.filter(g => (g.score/g.maxScore)*100 >= 60 && (g.score/g.maxScore)*100 < 70).length },
                { range: '0-59', label: 'F', color: 'bg-red-500', count: grades.filter(g => (g.score/g.maxScore)*100 < 60).length }
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