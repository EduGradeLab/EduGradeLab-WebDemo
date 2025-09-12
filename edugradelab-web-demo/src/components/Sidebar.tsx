'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  activePage?: 'upload' | 'documents'
}

export default function Sidebar({ activePage }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // activePage prop'u yoksa pathname'den belirle
  const currentPage = activePage || (pathname === '/demohome' ? 'upload' : 'documents')

  const menuItems = [
    { 
      id: 'upload', 
      label: 'Dosya Yükle', 
      href: '/demohome', 
      icon: '📁',
      description: 'Yeni sınav kağıdı analizi'
    },
    { 
      id: 'documents', 
      label: 'Dokümanlar', 
      href: '/document', 
      icon: '📄',
      description: 'Geçmiş analizler'
    },
  ]

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
        lg:translate-x-0 lg:static lg:z-auto
        /* Performance optimization */
        will-change: transform
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EduGradeLab</h1>
              <p className="text-sm text-gray-500">Demo Panel</p>
            </div>
          </div>

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200
                  ${currentPage === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:shadow-md'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                  ${currentPage === item.id 
                    ? 'bg-white bg-opacity-20 shadow-inner' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                  }
                `}>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-lg block">{item.label}</span>
                  <span className={`text-sm ${
                    currentPage === item.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
