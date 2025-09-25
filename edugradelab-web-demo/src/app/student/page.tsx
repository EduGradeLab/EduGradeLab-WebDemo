'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoStudents,
  getStudentById,
  getGradesByStudentId,
  getAchievementsByStudentId,
  getAnalyticsByStudentId,
  getStudentBadges,
  getClassById,
  demoClasses,
  demoBadges
} from '@/lib/demo-data'

export default function StudentDashboard() {
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
  const achievements = getAchievementsByStudentId(student.id)
  const analytics = getAnalyticsByStudentId(student.id)
  const badges = getStudentBadges(student.id)
  const studentClass = getClassById(student.classId)
  const recentGrades = grades.slice(0, 3)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="student" activePage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldin, {student.name}! 👋</h1>
            <p className="text-gray-600">
              {studentClass?.name} • {studentClass?.subject} • {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-sm text-gray-500">Genel Ortalama</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {analytics?.averageScore || 0}
              </div>
              <div className="text-sm text-gray-600">
                {analytics?.rank || 1}. sırada
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-sm text-gray-500">Gelişim</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                +{analytics?.improvement || 0}%
              </div>
              <div className="text-sm text-gray-600">
                Son sınavlarda
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-sm text-gray-500">Rozetler</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {badges.length}
              </div>
              <div className="text-sm text-gray-600">
                Toplam kazanılan
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <span className="text-sm text-gray-500">Tamamlanan</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {grades.length}
              </div>
              <div className="text-sm text-gray-600">
                Sınav/Ödev
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Grades */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Son Notlar</h2>
                <Link href="/student/grades" className="text-blue-600 hover:text-blue-800 text-sm">
                  Tümünü Gör →
                </Link>
              </div>
              <div className="space-y-4">
                {recentGrades.map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-900">Sınav #{grade.examId}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(grade.gradedAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getGradeColor(grade.score).split(' ')[0]}`}>
                        {grade.score}/{grade.maxScore}
                      </div>
                      <div className={`text-sm px-2 py-1 rounded-full ${getGradeColor(grade.score)}`}>
                        {getGradeLetter(grade.score)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Başarılar</h2>
                <Link href="/student/achievements" className="text-blue-600 hover:text-blue-800 text-sm">
                  Tümünü Gör →
                </Link>
              </div>
              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{achievement.title}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Güçlü Yönler</h2>
              <div className="flex flex-wrap gap-2">
                {analytics?.strengths.map((strength, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Kazanılan Rozetler</h2>
              <div className="grid grid-cols-4 gap-4">
                {badges.slice(0, 4).map((badge) => (
                  <div key={badge.id} className="text-center">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className="text-xs text-gray-600">{badge.name}</div>
                  </div>
                ))}
              </div>
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