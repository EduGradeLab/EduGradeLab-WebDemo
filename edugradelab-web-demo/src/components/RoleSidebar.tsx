'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface RoleSidebarProps {
  role: 'student' | 'teacher' | 'admin'
  activePage?: string
}

export default function RoleSidebar({ role, activePage }: RoleSidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mevcut sayfayı belirle
  const currentPage = activePage || pathname.split('/').pop() || 'dashboard'

  const getStudentMenuItems = () => [
    {
      id: 'dashboard',
      label: 'Ana Sayfa',
      href: '/student',
      icon: '🏠',
      description: 'Genel bakış'
    },
    {
      id: 'feed',
      label: 'Feed',
      href: '/feed',
      icon: '📰',
      description: 'Duyurular ve paylaşımlar'
    },
    {
      id: 'chat',
      label: 'Sohbet',
      href: '/chat',
      icon: '💬',
      description: 'Kanallar ve mesajlar'
    },
    {
      id: 'grades',
      label: 'Notlarım',
      href: '/student/grades',
      icon: '📊',
      description: 'Sınav sonuçları'
    },
    {
      id: 'progress',
      label: 'İlerleme',
      href: '/student/progress',
      icon: '📈',
      description: 'Gelişim grafiği'
    },
    {
      id: 'achievements',
      label: 'Başarılar',
      href: '/student/achievements',
      icon: '🏆',
      description: 'Rozetler ve ödüller'
    },
    {
      id: 'classes',
      label: 'Sınıflarım',
      href: '/student/classes',
      icon: '🏫',
      description: 'Sınıf bilgileri'
    }
  ]

  const getTeacherMenuItems = () => [
    {
      id: 'dashboard',
      label: 'Ana Sayfa',
      href: '/teacher',
      icon: '🏠',
      description: 'Genel bakış'
    },
    {
      id: 'feed',
      label: 'Feed',
      href: '/feed',
      icon: '📰',
      description: 'Duyurular ve paylaşımlar'
    },
    {
      id: 'chat',
      label: 'Sohbet',
      href: '/chat',
      icon: '💬',
      description: 'Kanallar ve mesajlar'
    },
    {
      id: 'classes',
      label: 'Sınıflar',
      href: '/teacher/classes',
      icon: '📚',
      description: 'Sınıf yönetimi'
    },
    {
      id: 'exams',
      label: 'Sınavlar',
      href: '/teacher/exams',
      icon: '📝',
      description: 'Sınav yönetimi'
    },
    {
      id: 'grading',
      label: 'Notlama',
      href: '/teacher/grading',
      icon: '✏️',
      description: 'Öğrenci notları'
    },
    {
      id: 'analytics',
      label: 'Analiz',
      href: '/teacher/analytics',
      icon: '📊',
      description: 'Sınıf performansı'
    }
  ]

  const getAdminMenuItems = () => [
    {
      id: 'dashboard',
      label: 'Ana Sayfa',
      href: '/admin',
      icon: '🏠',
      description: 'Sistem genel bakış'
    },
    {
      id: 'feed',
      label: 'Feed',
      href: '/feed',
      icon: '📰',
      description: 'Duyurular ve paylaşımlar'
    },
    {
      id: 'chat',
      label: 'Sohbet',
      href: '/chat',
      icon: '💬',
      description: 'Kanallar ve mesajlar'
    },
    {
      id: 'users',
      label: 'Kullanıcılar',
      href: '/admin/users',
      icon: '👥',
      description: 'Kullanıcı yönetimi'
    },
    {
      id: 'classes',
      label: 'Sınıflar',
      href: '/admin/classes',
      icon: '🏫',
      description: 'Sınıf yönetimi'
    },
    {
      id: 'analytics',
      label: 'Analizler',
      href: '/admin/analytics',
      icon: '📊',
      description: 'Sistem raporları'
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      href: '/admin/settings',
      icon: '⚙️',
      description: 'Sistem ayarları'
    }
  ]

  const getRoleConfig = () => {
    switch (role) {
      case 'student':
        return {
          title: 'Öğrenci Paneli',
          subtitle: 'Demo Öğrenci',
          color: 'from-green-500 to-blue-500',
          menuItems: getStudentMenuItems()
        }
      case 'teacher':
        return {
          title: 'Öğretmen Paneli',
          subtitle: 'Demo Öğretmen',
          color: 'from-purple-500 to-blue-500',
          menuItems: getTeacherMenuItems()
        }
      case 'admin':
        return {
          title: 'Admin Paneli',
          subtitle: 'Demo Yönetici',
          color: 'from-red-500 to-purple-500',
          menuItems: getAdminMenuItems()
        }
      default:
        return {
          title: 'Demo Paneli',
          subtitle: 'Demo Kullanıcı',
          color: 'from-blue-500 to-purple-500',
          menuItems: []
        }
    }
  }

  const roleConfig = getRoleConfig()

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className={`w-10 h-10 bg-gradient-to-r ${roleConfig.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EduGradeLab</h1>
              <p className="text-sm text-gray-500">{roleConfig.title}</p>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="mb-6 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-2">Demo Rolü</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{roleConfig.subtitle}</span>
              <Link
                href="/demologin"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Değiştir
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {roleConfig.menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200
                  ${currentPage === item.id
                    ? `bg-gradient-to-r ${roleConfig.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                  ${currentPage === item.id
                    ? 'bg-white bg-opacity-20 shadow-inner'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-lg block">{item.label}</span>
                  <span className={`text-sm ${
                    currentPage === item.id ? 'text-white text-opacity-80' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Back to Demo */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}