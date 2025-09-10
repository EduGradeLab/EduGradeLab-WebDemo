import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      user_id: user.id
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
    const [documents, total] = await Promise.all([
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

    // Get OCR results for each document separately
    const documentIds = documents.map(doc => doc.id)
    const ocrResults = await prisma.ocr_results.findMany({
      where: {
        exam_image_id: {
          in: documentIds
        }
      }
    })

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