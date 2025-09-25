'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoStudents,
  getStudentById,
  getAchievementsByStudentId,
  getStudentBadges,
  demoBadges
} from '@/lib/demo-data'

export default function StudentAchievements() {
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
  const achievements = getAchievementsByStudentId(student.id)
  const badges = getStudentBadges(student.id)
  const totalBadges = demoBadges.length
  const unlockedBadges = badges.length

  const getAchievementTypeIcon = (type: string) => {
    switch (type) {
      case 'grade': return '📊'
      case 'attendance': return '📅'
      case 'participation': return '🤝'
      case 'improvement': return '📈'
      default: return '🏆'
    }
  }

  const getAchievementTypeText = (type: string) => {
    switch (type) {
      case 'grade': return 'Not Başarısı'
      case 'attendance': return 'Devamlılık'
      case 'participation': return 'Katılım'
      case 'improvement': return 'Gelişim'
      default: return 'Başarı'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role="student" activePage="achievements" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Başarılarım</h1>
            <p className="text-gray-600">
              {student.name} • {unlockedBadges}/{totalBadges} rozet açıldı
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Başarı İlerlemem</h2>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((unlockedBadges / totalBadges) * 100)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedBadges / totalBadges) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{unlockedBadges} rozet kazanıldı</span>
              <span>{totalBadges - unlockedBadges} rozet kaldı</span>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Son Başarılar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{achievement.title}</div>
                      <div className="text-sm text-gray-600 mb-1">{achievement.description}</div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{getAchievementTypeText(achievement.type)}</span>
                        <span>•</span>
                        <span>{new Date(achievement.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Badge Collection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Rozet Koleksiyonu</h2>
              <div className="grid grid-cols-3 gap-4">
                {demoBadges.map((badge) => {
                  const isUnlocked = badges.some(b => b.id === badge.id)

                  return (
                    <div
                      key={badge.id}
                      className={`text-center p-3 rounded-xl transition-all duration-200 ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 shadow-md'
                          : 'bg-gray-50 border border-gray-200 opacity-50'
                      }`}
                    >
                      <div className={`text-3xl mb-2 ${isUnlocked ? 'transform scale-110' : 'grayscale'}`}>
                        {badge.icon}
                      </div>
                      <div className={`text-xs font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                        {badge.name}
                      </div>
                      {isUnlocked && (
                        <div className="mt-1">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Açıldı
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Sınıf Liderlik Tablosu</h2>
                <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                  Tamamını Gör →
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Ayşe Demir', score: 95, badges: 7 },
                  { rank: 2, name: 'Ahmet Yılmaz', score: 85, badges: 5 },
                  { rank: 3, name: 'Zeynep Çelik', score: 82, badges: 4 },
                  { rank: 4, name: 'Mehmet Kaya', score: 78, badges: 3 },
                  { rank: 5, name: student.name, score: 75, badges: badges.length, isMe: true }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      item.isMe
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        item.rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.rank}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${item.isMe ? 'text-blue-700' : 'text-gray-900'}`}>
                          {item.name} {item.isMe && '(Sen)'}
                        </div>
                        <div className="text-xs text-gray-600">{item.badges} rozet</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{item.score} puan</div>
                    </div>
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
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm başarılar ve rozetler örnek verilerdir.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}