import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Demo data for recent operations when database is not available
const demoRecentOperations = [
  {
    id: 1,
    jobId: 1,
    filename: 'matematik_sinavi.pdf',
    operation: 'OCR işlemi başlatıldı',
    level: 'INFO',
    status: 'DONE',
    score: 85,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    documentId: 1,
    ocrText: '1. x² + 5x + 6 = 0 denkleminin köklerini bulunuz.\n\nÇözüm:\nx² + 5x + 6 = 0\n(x + 2)(x + 3) = 0\nx = -2 veya x = -3',
    aiAnalysis: '{"score": 85, "feedback": "Öğrenci denklemin çözümünde doğru adımları izlemiş, cevap doğru.", "suggestions": ["Kontrol adımlarını daha detaylı yazabilirsiniz"]}'
  },
  {
    id: 2,
    jobId: 2,
    filename: 'fizik_lab.pdf',
    operation: 'yapay zeka analizi tamamlandı',
    level: 'INFO',
    status: 'DONE',
    score: 92,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    documentId: 2,
    ocrText: 'Newtonun 2. Yasası: F = m\n\nBir cismin ivmesi, üzerine etki eden net kuvvetle doğru orantılıdır.',
    aiAnalysis: '{"score": 92, "feedback": "Fizik prensiplerini doğru anlamış, formül doğru kullanılmış.", "suggestions": ["Birim eklemeyi unutmayın"]}'
  },
  {
    id: 3,
    jobId: 3,
    filename: 'kimya_test.pdf',
    operation: 'Dosya yüklendi',
    level: 'INFO',
    status: 'PROCESSING',
    score: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    documentId: 3,
    ocrText: null,
    aiAnalysis: null
  },
  {
    id: 4,
    jobId: 4,
    filename: 'edebiyat_soylu.pdf',
    operation: 'OCR metni çıkarıldı',
    level: 'INFO',
    status: 'DONE',
    score: 78,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    documentId: 4,
    ocrText: 'Memleket şiirinin ilk dörtlüğü:\n\nMemleket isterim\nNe ufuklar, ne dağlar\nNe havalar, ne sular\nNe bulutlar, ne yıldızlar',
    aiAnalysis: '{"score": 78, "feedback": "Şiir metni doğru tanımlanmış, ama analiz yüzeysel kalmış.", "suggestions": ["Daha derin edebi analiz yapın"]}'
  },
  {
    id: 5,
    jobId: 5,
    filename: 'tarih_sinavi.jpg',
    operation: 'yapay zeka analizi yapıldı',
    level: 'WARNING',
    status: 'DONE',
    score: 65,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    documentId: 5,
    ocrText: 'Kurtuluş Savaşı\n\n1919-1922 yılları arasında Türk ulusunun bağımsızlık için verdiği mücadele.',
    aiAnalysis: '{"score": 65, "feedback": "Temel bilgiler doğru, ancak detay eksik.", "suggestions": ["Tarih bilgilerini daha detaylı yazın", "Önemli tarihleri belirtin"]}'
  }
]

export async function GET(request: Request) {
  try {
    // Demo modunda authentication'ı bypass et ama veritabanından gerçek verileri çek
    const isDemoMode = process.env.NODE_ENV === 'development' || request.url.includes('localhost')

    const user = await getUserFromRequest(request as NextRequest)
    if (!user && !isDemoMode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(10, Math.max(1, parseInt(searchParams.get('limit') || '5', 10)))

    // Get recent exam images with OCR results instead of job logs
    const recentDocuments = await prisma.exam_images.findMany({
      where: isDemoMode ? {} : { user_id: user?.id },
      orderBy: {
        upload_time: 'desc'
      },
      take: limit
    })

    // Get OCR jobs and results separately
    const documentIds = recentDocuments.map(doc => doc.id)
    const ocrJobs = await prisma.ocr_jobs.findMany({
      where: {
        exam_image_id: {
          in: documentIds
        }
      }
    })
    const ocrResults = await prisma.ocr_results.findMany({
      where: {
        exam_image_id: {
          in: documentIds
        }
      }
    })

    if (!recentDocuments.length) {
      return NextResponse.json({
        message: 'No recent operations found',
        data: [],
        total: 0
      })
    }

    // Transform documents to operations format
    const operations = recentDocuments.map(doc => {
      const ocrJob = ocrJobs.find(job => job.exam_image_id === doc.id)
      const ocrResult = ocrResults.find(result => result.exam_image_id === doc.id)
      const score = ocrResult?.ai_analysis
        ? JSON.parse(ocrResult.ai_analysis).score || null
        : null

      // Determine status and operation based on document state
      let status = 'uploaded'
      let operation = 'Dosya yüklendi'
      let level = 'INFO'

      if (ocrJob) {
        switch (ocrJob.status) {
          case 'WAITING':
            status = 'WAITING'
            operation = 'OCR işlemi bekleniyor'
            break
          case 'PROCESSING':
            status = 'PROCESSING'
            operation = 'OCR işlemi yapılıyor'
            break
          case 'DONE':
            status = 'DONE'
            operation = ocrResult ? 'yapay zeka analizi tamamlandı' : 'OCR işlemi tamamlandı'
            break
          case 'ERROR':
            status = 'ERROR'
            operation = 'İşlem hatası'
            level = 'ERROR'
            break
        }
      }

      if (ocrResult) {
        if (!operation.includes('yapay zeka analizi')) {
          operation = 'yapay zeka analizi tamamlandı'
        }
      }

      return {
        id: doc.id,
        jobId: ocrJob?.id || doc.id,
        filename: doc.filename,
        operation: operation,
        level: level,
        status: status,
        score: score,
        createdAt: doc.upload_time.toISOString(),
        documentId: doc.id,
        ocrText: ocrResult?.ocr_text || null,
        aiAnalysis: ocrResult?.ai_analysis || null
      }
    })

    return NextResponse.json({
      message: 'Recent operations fetched successfully' + (isDemoMode ? ' (Demo Mode)' : ''),
      data: operations,
      total: operations.length
    })
  } catch (error) {
    console.error('Database error in recent-results:', error)

    // Database hatası durumunda demo veri döndür (fallback)
    const demoData = demoRecentOperations.slice(0, 5)
    return NextResponse.json({
      message: 'Recent operations fetched successfully (Demo Mode - Fallback)',
      data: demoData,
      total: demoData.length
    })
  }
}