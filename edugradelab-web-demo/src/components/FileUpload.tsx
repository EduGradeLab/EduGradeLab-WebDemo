'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isUploading?: boolean
}

export default function FileUpload({ onFileSelect, isUploading = false }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isUploading
  })

  const dropzoneClasses = `
    relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 overflow-hidden
    ${isDragActive && !isDragReject 
      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105 shadow-lg' 
      : isDragReject 
        ? 'border-red-500 bg-gradient-to-br from-red-50 to-pink-50' 
        : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
    }
    ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
  `

  return (
    <div {...getRootProps()} className={dropzoneClasses}>
      <input {...getInputProps()} />
      
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
      </div>
      
      <div className="relative space-y-6">
        <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isDragActive && !isDragReject 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-110' 
            : isDragReject
              ? 'bg-gradient-to-br from-red-500 to-pink-600'
              : 'bg-gradient-to-br from-gray-100 to-gray-200'
        }`}>
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
          ) : isDragActive && !isDragReject ? (
            <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          ) : isDragReject ? (
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>
        
        <div>
          <h3 className={`text-2xl font-bold mb-2 ${
            isDragActive && !isDragReject 
              ? 'text-blue-600' 
              : isDragReject 
                ? 'text-red-600'
                : 'text-gray-900'
          }`}>
            {isUploading 
              ? 'Dosya Yükleniyor...' 
              : isDragActive && !isDragReject 
                ? 'Dosyayı Bırakın!' 
                : isDragReject
                  ? 'Geçersiz Dosya!'
                  : 'Sınav Kağıdı Yükleyin'
            }
          </h3>
          <p className={`text-lg ${
            isDragActive && !isDragReject 
              ? 'text-blue-500' 
              : isDragReject 
                ? 'text-red-500'
                : 'text-gray-600'
          }`}>
            {isUploading 
              ? 'Lütfen bekleyin...'
              : isDragActive && !isDragReject 
                ? 'Hemen analiz başlayacak'
                : isDragReject
                  ? 'Sadece resim veya PDF dosyası'
                  : 'Sürükleyip bırakın veya seçin'
            }
          </p>
        </div>

        {!isUploading && !isDragActive && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">JPEG, PNG</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">PDF</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">Max 10MB</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                className="mx-auto block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Dosya Seç
              </button>
            </div>
          </div>
        )}

        {isDragReject && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-medium">
              ⚠️ Lütfen sadece resim (JPEG, PNG) veya PDF dosyası seçin
            </p>
          </div>
        )}

        {isUploading && (
          <div className="flex items-center justify-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
            </div>
            <span className="text-lg font-medium text-gray-700">Analiz hazırlanıyor...</span>
          </div>
        )}
      </div>
    </div>
  )
}