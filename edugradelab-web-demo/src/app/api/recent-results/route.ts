import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Define type for OCR results
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(10, Math.max(1, parseInt(searchParams.get('limit') || '5', 10)))

    // Get recent exam images
    const recentResults = await prisma.exam_images.findMany({
      orderBy: {
        upload_time: 'desc'
      },
      take: limit
    })

    if (!recentResults.length) {
      return NextResponse.json({ 
        message: 'No recent results found',
        data: [],
        total: 0
      })
    }

    // Get OCR results for each document separately
    const documentIds = recentResults.map(doc => doc.id)
    let ocrResults: OcrResult[] = []
    
    try {
      ocrResults = await prisma.ocr_results.findMany({
        where: {
          exam_image_id: {
            in: documentIds
          }
        }
      })
    } catch (error) {
      console.error('Error fetching OCR results:', error)
      return NextResponse.json({ error: 'Failed to fetch OCR results' }, { status: 500 })
    }

    // Combine exam images with their OCR results
    const resultsWithOcrData = recentResults.map(result => {
      const ocrResult = ocrResults.find(r => r.exam_image_id === result.id)
      
      return {
        id: result.id,
        filename: result.filename,
        uploadDate: result.upload_time,
        status: result.status,
        ocrText: ocrResult?.ocr_text,
        aiAnalysis: ocrResult?.ai_analysis,
        score: ocrResult?.ai_analysis
          ? JSON.parse(ocrResult.ai_analysis).score || null
          : null
      }
    })

    return NextResponse.json({
      message: 'Recent results fetched successfully',
      data: resultsWithOcrData,
      total: resultsWithOcrData.length
    })
  } catch (error) {
    console.error('Database error in recent-results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}