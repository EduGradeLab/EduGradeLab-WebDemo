import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Define type for OCR results to match Prisma schema
interface OcrResult {
  id: number
  exam_image_id: number
  user_id: number
  ocr_text: string | null
  ai_analysis: string | null
  processed_at: Date
  processing_time_ms: number | null
  webhook_status: string
  webhook_response: string | null
  feedback: string | null
}

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

    // Build where clause
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
      where.status = status
    }

    // Get documents with pagination
    let documents, total
    try {
      [documents, total] = await Promise.all([
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
      console.error('Database error while fetching documents:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Get OCR results for each document separately
    const documentIds = documents.map(doc => doc.id)
    let ocrResults: OcrResult[] = []
    try {
      ocrResults = await prisma.ocr_results.findMany({
        where: {
          exam_image_id: {
            in: documentIds
          }
        }
      })
    } catch (dbError) {
      console.error('Database error while fetching OCR results:', dbError)
      // Continue without OCR results if error occurs
      ocrResults = []
    }

    const formattedDocuments = documents.map((doc) => {
      const ocrResult = ocrResults.find(result => result.exam_image_id === doc.id)
      return {
        id: doc.id.toString(),
        filename: doc.filename,
        uploadTime: doc.upload_time.toISOString(),
        status: doc.status,
        score: ocrResult?.ai_analysis 
          ? Math.floor(Math.random() * 30) + 70 // Mock score for demo
          : undefined,
        processingTime: ocrResult?.processing_time_ms,
        ocrText: ocrResult?.ocr_text,
        aiAnalysis: ocrResult?.ai_analysis
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