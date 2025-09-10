'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isUploading?: boolean
}

export default function FileUpload({ onFileSelect, isUploading = false }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isUploading
  })

  const dropzoneClasses = `
    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
    ${isDragActive && !isDragReject 
      ? 'border-blue-500 bg-blue-50' 
      : isDragReject 
        ? 'border-red-500 bg-red-50' 
        : 'border-gray-300 hover:border-gray-400'
    }
    ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
  `

  return (
    <div {...getRootProps()} className={dropzoneClasses}>
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-900">
            {isUploading ? 'Dosya Yükleniyor...' : 'Sınav Kağıdı Yükleyin'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {isDragActive 
              ? 'Dosyayı buraya bırakın' 
              : 'Sürükleyip bırakın veya seçin'
            }
          </p>
        </div>

        {!isUploading && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Desteklenen formatlar: JPEG, PNG, PDF
            </p>
            <p className="text-xs text-gray-500">
              Maksimum dosya boyutu: 10MB
            </p>
          </div>
        )}

        {isDragReject && (
          <div className="text-red-600 text-sm">
            Lütfen geçerli bir dosya formatı seçin
          </div>
        )}

        {isUploading && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">İşleniyor...</span>
          </div>
        )}
      </div>
    </div>
  )
}