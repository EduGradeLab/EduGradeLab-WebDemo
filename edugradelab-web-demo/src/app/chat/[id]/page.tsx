'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoChatChannels,
  getMessagesByChannelId,
  demoStudents,
  demoTeachers
} from '@/lib/demo-data'

export default function ChatChannelPage() {
  const router = useRouter()
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'admin'>('student')
  const [channelId, setChannelId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage'dan rol bilgisini kontrol et
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole === 'student' || demoRole === 'teacher' || demoRole === 'admin') {
      setCurrentRole(demoRole)
    }

    // URL'den channel ID'yi al
    const id = window.location.pathname.split('/').pop()
    if (id) {
      setChannelId(id)
    }

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

  const currentUser = currentRole === 'student' ? demoStudents[0] :
                     currentRole === 'teacher' ? demoTeachers[0] :
                     { name: 'Admin User', id: 'admin1' }

  const channelData = demoChatChannels.find(c => c.id === channelId)
  const messages = channelId ? getMessagesByChannelId(channelId) : []

  if (!channelData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kanal Bulunamadı</h1>
          <button
            onClick={() => router.push('/chat')}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Sohbetlere Dön
          </button>
        </div>
      </div>
    )
  }

  const getChannelTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-green-100 text-green-700'
      case 'subject': return 'bg-blue-100 text-blue-700'
      case 'school': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getChannelTypeText = (type: string) => {
    switch (type) {
      case 'class': return 'Sınıf'
      case 'subject': return 'Ders'
      case 'school': return 'Okul'
      default: return 'Genel'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'text-purple-600 bg-purple-100'
      case 'admin': return 'text-red-600 bg-red-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'teacher': return 'Öğretmen'
      case 'admin': return 'Yönetici'
      default: return 'Öğrenci'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('tr-TR')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role={currentRole} activePage="chat" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto h-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/chat')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Tüm Kanallara Dön
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{channelData.name}</h1>
                <p className="text-gray-600">
                  {currentUser.name} • {getRoleText(currentRole)}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">{channelData.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${getChannelTypeColor(channelData.type)}`}>
                      {getChannelTypeText(channelData.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{channelData.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{channelData.memberCount} üye</span>
                  <button className="text-gray-500 hover:text-gray-700">
                    ⚙️
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.authorName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(message.authorRole)}`}>
                          {getRoleText(message.authorRole)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                      {message.type === 'announcement' && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <span className="text-xs text-blue-600">📢 Duyuru</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Assistant Suggestion */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🤖</span>
                  <h3 className="font-semibold text-gray-900">AI Asistan</h3>
                </div>
                <p className="text-sm text-gray-700">
                  Bu kanalda soru soran {messages.filter(m => m.content.includes('?')).length} kişi var.
                  Cevaplamak ister misiniz?
                </p>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                  Gönder
                </button>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  📎 Dosya Ekle
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  😊 Emoji
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  @ Kişi Etiketle
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  📊 Anket
                </button>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm sohbet verileri örnek verilerdir.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}