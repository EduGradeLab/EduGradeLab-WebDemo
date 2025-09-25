'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoStudents,
  getStudentById,
  getGradesByStudentId,
  getAnalyticsByStudentId,
  getClassById
} from '@/lib/demo-data'

export default function StudentProgress() {
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
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const student = currentStudent
  const grades = getGradesByStudentId(student.id)
  const analytics = getAnalyticsByStudentId(student.id)
  const studentClass = getClassById(student.classId)

  // Mock progress data
  const progressData = [
    { month: 'Eylül', score: 75, classAvg: 72 },
    { month: 'Ekim', score: 78, classAvg: 74 },
    { month: 'Kasım', score: 82, classAvg: 76 },
    { month: 'Aralık', score: 85, classAvg: 78 },
    { month: 'Ocak', score: 88, classAvg: 80 }
  ]

  const subjectProgress = [
    { subject: 'Matematik', score: 85, improvement: '+10%', color: 'bg-blue-500' },
    { subject: 'Fizik', score: 78, improvement: '+5%', color: 'bg-purple-500' },
    { subject: 'Kimya', score: 82, improvement: '+8%', color: 'bg-green-500' },
    { subject: 'Türkçe', score: 90, improvement: '+12%', color: 'bg-yellow-500' },
    { subject: 'Tarih', score: 76, improvement: '+3%', color: 'bg-red-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <RoleSidebar role="student" activePage="progress" />
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">İlerleme Takibim</h1>
            <p className="text-gray-600">
              {student.name} • {studentClass?.name} • {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-sm text-gray-500">Toplam Gelişim</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                +{analytics?.improvement || 0}%
              </div>
              <div className="text-sm text-gray-600">
                Bu dönem
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-sm text-gray-500">Ortalama</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {analytics?.averageScore || 0}
              </div>
              <div className="text-sm text-gray-600">
                Tüm dersler
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-sm text-gray-500">Sıralama</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {analytics?.rank || 1}
              </div>
              <div className="text-sm text-gray-600">
                Sınıf içi
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-sm text-gray-500">Hedef</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                90
              </div>
              <div className="text-sm text-gray-600">
                Yıl sonu hedefi
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Aylık Gelişim Grafiği</h2>
            <div className="space-y-4">
              {progressData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium text-gray-700">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${data.score}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-bold text-gray-900 w-12 text-right">{data.score}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: `${data.classAvg}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 w-12 text-right">Snf: {data.classAvg}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ders Bazında Gelişim</h2>
              <div className="space-y-4">
                {subjectProgress.map((subject, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 ${subject.color} rounded-full`}></div>
                        <span className="font-medium text-gray-900">{subject.subject}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{subject.score}</span>
                        <span className="text-sm text-green-600 font-medium">{subject.improvement}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${subject.color} transition-all duration-500`}
                        style={{ width: `${subject.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Güçlü ve Zayıf Yönler</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-green-700">Güçlü Yönler</h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics?.strengths.map((strength, index) => (
                      <span key={index} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-red-700">Geliştirilmesi Gerekenler</h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics?.weaknesses.map((weakness, index) => (
                      <span key={index} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                        {weakness}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Öneriler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Matematik Alıştırması', type: 'practice', icon: '📝', priority: 'high' },
                { title: 'Fizik Deneyleri', type: 'experiment', icon: '🧪', priority: 'medium' },
                { title: 'Kimya Formülleri', type: 'study', icon: '📚', priority: 'medium' },
                { title: 'Kelime Çalışması', type: 'vocabulary', icon: '📖', priority: 'low' },
                { title: 'Problem Çözme', type: 'practice', icon: '🧮', priority: 'high' },
                { title: 'Okuma Parçaları', type: 'reading', icon: '📄', priority: 'low' }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.priority === 'high' ? 'Acil' :
                       item.priority === 'medium' ? 'Önemli' : 'Tavsiye'}
                    </span>
                  </div>
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.type === 'practice' ? 'Alıştırma yap' :
                     item.type === 'experiment' ? 'Deney yap' :
                     item.type === 'study' ? 'Çalış' :
                     item.type === 'vocabulary' ? 'Kelime öğren' :
                     item.type === 'reading' ? 'Oku' : 'Çöz'}
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
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm ilerleme verileri örnek verilerdir.</p>
              </div>
            </div>
          </div>
            </div>
      </div>
    </div>
  )
}