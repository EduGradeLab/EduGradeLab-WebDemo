'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoChatChannels,
  getMessagesByChannelId,
  demoStudents,
  demoTeachers
} from '@/lib/demo-data'

export default function ChatPage() {
  const params = useParams()
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'admin'>('student')
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage'dan rol bilgisini kontrol et
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole === 'student' || demoRole === 'teacher' || demoRole === 'admin') {
      setCurrentRole(demoRole)
    }

    // URL'de channel ID varsa onu seç
    if (params.id) {
      setSelectedChannel(params.id as string)
    } else {
      // İlk kanalı seç
      setSelectedChannel(demoChatChannels[0]?.id || '')
    }

    setIsLoading(false)
  }, [params.id])

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

  const selectedChannelData = demoChatChannels.find(c => c.id === selectedChannel)
  const messages = selectedChannel ? getMessagesByChannelId(selectedChannel) : []

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
        <div className="max-w-7xl mx-auto h-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sohbet Kanalları</h1>
            <p className="text-gray-600">
              {currentUser.name} • {getRoleText(currentRole)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Channel List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Kanallar</h2>

                  {/* Channel Type Filters */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Tümü
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200">
                      Sınıf
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200">
                      Ders
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200">
                      Okul
                    </button>
                  </div>
                </div>

                {/* Channel List */}
                <div className="space-y-3">
                  {demoChatChannels.map((channel) => (
                    <Link
                      key={channel.id}
                      href={`/chat/${channel.id}`}
                      className={`block p-4 rounded-xl transition-colors cursor-pointer ${
                        selectedChannel === channel.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${getChannelTypeColor(channel.type)}`}>
                              {getChannelTypeText(channel.type)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                          {channel.lastMessage && (
                            <p className="text-sm text-gray-700 truncate">{channel.lastMessage}</p>
                          )}
                        </div>
                        {channel.unreadCount && channel.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {channel.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{channel.memberCount} üye</span>
                        {channel.lastMessageTime && (
                          <span>{formatTime(channel.lastMessageTime)}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* AI Assistant */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">🤖</span>
                    <h3 className="font-semibold text-gray-900">AI Asistan</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Sorularınız için yanıt bekleyen {messages.filter(m => m.content.includes('?')).length} mesaj bulundu
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
                {selectedChannelData ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{selectedChannelData.name}</h2>
                          <p className="text-sm text-gray-600">{selectedChannelData.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${getChannelTypeColor(selectedChannelData.type)}`}>
                            {getChannelTypeText(selectedChannelData.type)}
                          </span>
                          <span className="text-sm text-gray-500">{selectedChannelData.memberCount} üye</span>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm">👤</span>
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
                            </div>
                          </div>
                        ))}
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
                          📎 Dosya
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 transition-colors">
                          😊 Emoji
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 transition-colors">
                          @ Etiket
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Bir Kanal Seçin</h3>
                      <p className="text-gray-600">Sohbet etmek için soldan bir kanal seçin</p>
                    </div>
                  </div>
                )}
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