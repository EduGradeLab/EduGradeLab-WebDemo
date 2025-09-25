'use client'

import { useState, useEffect } from 'react'
import RoleSidebar from '@/components/RoleSidebar'
import {
  getFeedPostsByFilter,
  demoStudents,
  demoTeachers
} from '@/lib/demo-data'

export default function FeedPage() {
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'admin'>('student')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'my-class' | 'my-posts'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage'dan rol bilgisini kontrol et
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole === 'student' || demoRole === 'teacher' || demoRole === 'admin') {
      setCurrentRole(demoRole)
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

  const feedPosts = getFeedPostsByFilter(selectedFilter)
  const currentUser = currentRole === 'student' ? demoStudents[0] :
                     currentRole === 'teacher' ? demoTeachers[0] :
                     { name: 'Admin User', id: 'admin1' }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-700'
      case 'achievement': return 'bg-green-100 text-green-700'
      case 'reminder': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPostTypeText = (type: string) => {
    switch (type) {
      case 'announcement': return 'Duyuru'
      case 'achievement': return 'Başarı'
      case 'reminder': return 'Hatırlatma'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex sidebar-overflow-fix">
      <RoleSidebar role={currentRole} activePage="feed" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Feed</h1>
            <p className="text-gray-600">
              {currentUser.name} • {getRoleText(currentRole)}
            </p>
          </div>

          {/* AI Suggestions */}
          <div className="ai-suggestion-card mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold">AI Önerileri</h3>
            </div>
            <p className="text-blue-100">
              Sizin için önerilen içerikler: Matematik sınav sonuçları, sınıf arkadaşlarınızın başarıları ve yaklaştan etkinlikler
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-8">
            <div className="feed-filters">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`feed-filter-button ${selectedFilter === 'all' ? 'active' : ''}`}
              >
                Tümü
              </button>
              <button
                onClick={() => setSelectedFilter('my-class')}
                className={`feed-filter-button ${selectedFilter === 'my-class' ? 'active' : ''}`}
              >
                Sınıfım
              </button>
              <button
                onClick={() => setSelectedFilter('my-posts')}
                className={`feed-filter-button ${selectedFilter === 'my-posts' ? 'active' : ''}`}
              >
                Benim Paylaşımlarım
              </button>
            </div>
          </div>

          {/* Create Post */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 feed-create-post">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Neler paylaşırsın?"
                  className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    <button className="chat-tool-button">
                      📷 Fotoğraf
                    </button>
                    <button className="chat-tool-button">
                      📁 Dosya
                    </button>
                    <button className="chat-tool-button">
                      🏷️ Etiket
                    </button>
                  </div>
                  <button className="chat-send-button">
                    Paylaş
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-6">
            {feedPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{post.authorName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(post.authorRole)}`}>
                          {getRoleText(post.authorRole)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{new Date(post.timestamp).toLocaleDateString('tr-TR')}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPostTypeColor(post.type)}`}>
                          {getPostTypeText(post.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-900 leading-relaxed">{post.content}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <span>👍</span>
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <span>💬</span>
                      <span className="text-sm">{post.comments.length}</span>
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700 transition-colors">
                    ↗️ Paylaş
                  </button>
                </div>

                {/* Comments */}
                {post.comments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="space-y-4">
                      {post.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">👤</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{comment.authorName}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(comment.authorRole)}`}>
                                {getRoleText(comment.authorRole)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      {post.comments.length > 2 && (
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                          Tüm {post.comments.length} yorumu gör →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Tüm feed içerikleri örnek verilerdir.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}