import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Demo için authentication bypass
    const user = await getUserFromRequest(request)
    
    // Demo modunda authentication'ı bypass et
    const isDemoMode = process.env.NODE_ENV === 'development' || request.url.includes('localhost')
    
    if (!user && !isDemoMode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    let page, limit
    
    try {
      page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
      limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
      
      if (page < 1) page = 1
      if (limit < 1 || limit > 100) limit = 10
    } catch {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 })
    }

    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Build where clause for exam_images
    const where: Record<string, unknown> = {}

    // Demo modunda user_id kontrolü yapma
    if (user && user.id) {
      where.user_id = user.id
    }

    if (search) {
      where.filename = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (status !== 'all') {
      // Status mapping for database compatibility
      const statusMapping: Record<string, string> = {
        'uploaded': 'UPLOADED',
        'processing': 'PROCESSING', 
        'completed': 'PROCESSED',
        'analyzing': 'PROCESSING',
        'failed': 'ERROR',
        'error': 'ERROR'
      }
      
      where.status = statusMapping[status] || status.toUpperCase()
    }

    // Get exam_images with pagination using proper SQL logic
    let examImages, total
    try {
      [examImages, total] = await Promise.all([
        prisma.exam_images.findMany({
          where,
          orderBy: {
            upload_time: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.exam_images.count({ where })
      ])
    } catch (dbError) {
      console.error('Database error while fetching exam images:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Get OCR jobs and results using proper table relationships
    const examImageIds = examImages.map(img => img.id)
    let ocrJobs: Awaited<ReturnType<typeof prisma.ocr_jobs.findMany>> = []
    let ocrResults: Awaited<ReturnType<typeof prisma.ocr_results.findMany>> = []

    if (examImageIds.length > 0) {
      try {
        // First get OCR jobs for these exam images
        ocrJobs = await prisma.ocr_jobs.findMany({
          where: {
            exam_image_id: {
              in: examImageIds
            }
          }
        })

        // Then get OCR results using exam_image_ids from ocr_jobs
        const examImageIdsWithJobs = ocrJobs.map(job => job.exam_image_id).filter(id => id)
        if (examImageIdsWithJobs.length > 0) {
          ocrResults = await prisma.ocr_results.findMany({
            where: {
              exam_image_id: {
                in: examImageIdsWithJobs
              }
            }
          })
        }
      } catch (dbError) {
        console.error('Database error while fetching OCR data:', dbError)
        ocrJobs = []
        ocrResults = []
      }
    }

    const formattedDocuments = examImages.map((img) => {
      // Find OCR job for this exam image
      const ocrJob = ocrJobs.find(job => job.exam_image_id === img.id)
      // Find OCR result using exam_image_id
      const ocrResult = ocrResults.find(result => result.exam_image_id === img.id)
      
      // Determine status based on exam_images and OCR jobs
      let status = img.status.toLowerCase()
      if (ocrJob) {
        switch (ocrJob.status) {
          case 'WAITING':
            status = 'pending'
            break
          case 'PROCESSING':
            status = 'analyzing'
            break
          case 'DONE':
            status = 'completed'
            break
          case 'ERROR':
            status = 'error'
            break
        }
      }

      return {
        id: img.id.toString(),
        filename: img.filename,
        uploadTime: img.upload_time.toISOString(),
        status: status,
        score: ocrResult?.ai_analysis 
          ? Math.floor(Math.random() * 30) + 70 // Mock score for demo
          : undefined,
        processingTime: ocrResult?.processing_time_ms,
        ocrText: ocrResult?.ocr_text,
        aiAnalysis: ocrResult?.ai_analysis,
        fileType: img.filetype?.toLowerCase() as 'pdf' | 'image' || 'image',
        fileSize: img.image_blob ? `${Math.round(img.image_blob.length / 1024)} KB` : undefined,
        name: img.filename
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
      }
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      documents: formattedDocuments,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    })

  } catch (error) {
    console.error('Documents API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}