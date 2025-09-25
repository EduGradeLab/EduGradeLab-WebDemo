'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RoleSidebar from '@/components/RoleSidebar'
import {
  demoStudents,
  getStudentById,
  demoClasses,
  getClassById
} from '@/lib/demo-data'

export default function StudentClasses() {
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
  const studentClass = getClassById(student.classId)
  const otherClasses = demoClasses.filter(cls => cls.id !== studentClass?.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <RoleSidebar role="student" activePage="classes" />
      <div className="flex-1 lg:ml-0 p-6 lg:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sınıflarım</h1>
            <p className="text-gray-600">
              {student.name} • {studentClass?.name} • {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* My Class */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Ana Sınıfım</h2>
              <Link href={`/student/classes/${studentClass?.id}`} className="text-green-600 hover:text-green-800 text-sm">
                Sınıfa Git →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                <div className="text-5xl mb-4">📚</div>
                <div className="font-bold text-gray-900 text-lg">{studentClass?.name}</div>
                <div className="text-sm text-gray-600 mb-2">{studentClass?.subject}</div>
                <div className="text-xs text-gray-500">{studentClass?.studentCount} öğrenci</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="text-5xl mb-4">👨‍🏫</div>
                <div className="font-bold text-gray-900 text-lg">Sorumlu Öğretmen</div>
                <div className="text-sm text-gray-600 mb-2">Dr. Selin Aksoy</div>
                <div className="text-xs text-gray-500">Matematik</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-5xl mb-4">📊</div>
                <div className="font-bold text-gray-900 text-lg">Sınav Ortalaması</div>
                <div className="text-sm text-gray-600 mb-2">85%</div>
                <div className="text-xs text-gray-500">Son 3 sınav</div>
              </div>
            </div>
          </div>

          {/* Other Available Classes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Diğer Sınıflar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherClasses.map((cls) => (
                <div key={cls.id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{cls.name}</div>
                      <div className="text-sm text-gray-600">{cls.subject}</div>
                    </div>
                    <div className="text-3xl opacity-50">🏫</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Öğrenci Sayısı:</span>
                      <span className="font-medium">{cls.studentCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sınıf Kodu:</span>
                      <span className="font-medium">{cls.code}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      disabled
                    >
                      Katılmak İçin İzin Gerekli
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-gray-900">92%</div>
                <div className="text-sm text-gray-600">Katılım Oranı</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-gray-900">+15%</div>
                <div className="text-sm text-gray-600">Gelişim</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Kazanılan Rozet</div>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Modu</p>
                <p className="text-xs text-yellow-600">Bu bir demo ortamıdır. Sınıf değiştirme özellikleri sınırlıdır.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}